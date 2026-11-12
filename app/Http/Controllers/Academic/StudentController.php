<?php

namespace App\Http\Controllers\Academic;

use App\Actions\Academic\AssignStudentToClassroom;
use App\Actions\Academic\TransferStudentClassroom;
use App\Actions\Users\CreateUserFromStudent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\ImportExcelRequest;
use App\Http\Requests\Academic\StudentRequest;
use App\Imports\StudentsImport;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $classroomId = $request->input('classroom_id');

        $activeYear = AcademicYear::active()->first() ?? AcademicYear::latest()->first();

        $students = Student::with(['user', 'currentStudentClassroom.classroom', 'guardians'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'ilike', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($classroomId, function ($query, $classroomId) {
                $query->whereHas('studentClassrooms', function ($q) use ($classroomId) {
                    $q->where('classroom_id', $classroomId)->where('status', 'active');
                });
            })
            ->orderBy('full_name')
            ->paginate(15)
            ->withQueryString();

        $classrooms = Classroom::where('academic_year_id', $activeYear?->id)
            ->orderBy('name')
            ->get();

        $guardians = Guardian::orderBy('name')->get();

        return Inertia::render('Academic/Students/Index', [
            'students' => $students,
            'classrooms' => $classrooms,
            'guardians' => $guardians,
            'filters' => [
                'search' => $search,
                'classroom_id' => $classroomId ? (int) $classroomId : null,
            ],
        ]);
    }

    public function store(StudentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $classroomId = $data['classroom_id'] ?? null;
        $guardianId = $data['guardian_id'] ?? null;
        $relationship = $data['guardian_relationship'] ?? 'parent';
        $createUser = $request->boolean('create_user');

        unset($data['classroom_id'], $data['guardian_id'], $data['guardian_relationship'], $data['create_user']);

        $student = Student::create($data);

        // Assign to classroom
        if ($classroomId) {
            $classroom = Classroom::find($classroomId);
            if ($classroom) {
                app(AssignStudentToClassroom::class)->execute($student, $classroom);
            }
        }

        // Link Guardian
        if ($guardianId) {
            $student->guardians()->syncWithoutDetaching([
                $guardianId => ['relationship' => $relationship, 'is_emergency_contact' => true],
            ]);
        }

        // Generate user account if requested
        if ($createUser) {
            app(CreateUserFromStudent::class)->execute($student);
        }

        return redirect()->back()->with('success', "Siswa {$student->full_name} berhasil ditambahkan.");
    }

    public function update(StudentRequest $request, Student $student): RedirectResponse
    {
        $data = $request->validated();
        unset($data['classroom_id'], $data['guardian_id'], $data['guardian_relationship'], $data['create_user']);

        $student->update($data);

        return redirect()->back()->with('success', "Data siswa {$student->full_name} berhasil diperbarui.");
    }

    public function destroy(Student $student): RedirectResponse
    {
        $name = $student->full_name;
        $student->delete();

        return redirect()->back()->with('success', "Siswa {$name} berhasil dinonaktifkan (soft delete).");
    }

    public function transfer(Request $request, Student $student, TransferStudentClassroom $action): RedirectResponse
    {
        $request->validate([
            'target_classroom_id' => ['required', 'exists:classrooms,id'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $targetClassroom = Classroom::findOrFail($request->input('target_classroom_id'));
        $action->execute($student, $targetClassroom, $request->input('notes'));

        return redirect()->back()->with('success', "Siswa {$student->full_name} berhasil dipindahkan ke kelas {$targetClassroom->name}.");
    }

    public function generateUser(Student $student): RedirectResponse
    {
        app(CreateUserFromStudent::class)->execute($student);

        return redirect()->back()->with('success', "Akun login untuk {$student->full_name} berhasil dibuat.");
    }

    public function import(ImportExcelRequest $request): RedirectResponse
    {
        $activeYear = AcademicYear::active()->first();
        $import = new StudentsImport($activeYear?->id);
        $import->import($request->file('file'));

        if ($import->failures()->isNotEmpty()) {
            $errors = [];
            foreach ($import->failures() as $failure) {
                $errors[] = "Baris {$failure->row()}: ".implode(', ', $failure->errors());
            }

            return redirect()->back()->with('error', 'Beberapa baris gagal diimpor: '.implode('; ', array_slice($errors, 0, 5)));
        }

        return redirect()->back()->with('success', 'Data siswa berhasil diimpor dari Excel.');
    }
}
