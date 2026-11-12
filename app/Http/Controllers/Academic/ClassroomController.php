<?php

namespace App\Http\Controllers\Academic;

use App\Actions\Academic\AssignHomeroomTeacher;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\ClassroomRequest;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\GradeLevel;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::active()->first() ?? AcademicYear::latest()->first();
        $selectedYearId = $request->input('academic_year_id', $activeYear?->id);

        $classrooms = Classroom::with(['gradeLevel', 'department', 'homeroomTeacher'])
            ->withCount(['students' => function ($query) {
                $query->where('student_classrooms.status', 'active');
            }])
            ->where('academic_year_id', $selectedYearId)
            ->orderBy('name')
            ->get();

        $academicYears = AcademicYear::orderByDesc('name')->get();
        $gradeLevels = GradeLevel::orderBy('level_number')->get();
        $departments = Department::where('is_active', true)->orderBy('code')->get();
        $teachers = Teacher::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Academic/Classrooms/Index', [
            'classrooms' => $classrooms,
            'academicYears' => $academicYears,
            'gradeLevels' => $gradeLevels,
            'departments' => $departments,
            'teachers' => $teachers,
            'selectedYearId' => (int) $selectedYearId,
        ]);
    }

    public function store(ClassroomRequest $request, AssignHomeroomTeacher $action): RedirectResponse
    {
        $data = $request->validated();
        $teacherId = $data['homeroom_teacher_id'] ?? null;
        unset($data['homeroom_teacher_id']);

        $classroom = Classroom::create($data);

        if ($teacherId) {
            $teacher = Teacher::find($teacherId);
            $action->execute($classroom, $teacher);
        }

        return redirect()->back()->with('success', "Rombel {$classroom->name} berhasil dibuat.");
    }

    public function update(ClassroomRequest $request, Classroom $classroom, AssignHomeroomTeacher $action): RedirectResponse
    {
        $data = $request->validated();
        $teacherId = $data['homeroom_teacher_id'] ?? null;
        unset($data['homeroom_teacher_id']);

        $classroom->update($data);

        $teacher = $teacherId ? Teacher::find($teacherId) : null;
        $action->execute($classroom, $teacher);

        return redirect()->back()->with('success', "Data rombel {$classroom->name} berhasil diperbarui.");
    }

    public function destroy(Classroom $classroom): RedirectResponse
    {
        $name = $classroom->name;
        $classroom->delete();

        return redirect()->back()->with('success', "Rombel {$name} berhasil dihapus.");
    }
}
