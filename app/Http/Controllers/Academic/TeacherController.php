<?php

namespace App\Http\Controllers\Academic;

use App\Actions\Users\CreateUserFromTeacher;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\ImportExcelRequest;
use App\Http\Requests\Academic\TeacherRequest;
use App\Imports\TeachersImport;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $teachers = Teacher::with(['user', 'currentHomeroomClassroom'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Academic/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(TeacherRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $createUser = $request->boolean('create_user');
        unset($data['create_user']);

        if ($request->hasFile('photo_file')) {
            $path = $request->file('photo_file')->store('teachers', 'public');
            $data['photo'] = Storage::url($path);
        }
        unset($data['photo_file']);

        $teacher = Teacher::create($data);

        if ($createUser) {
            app(CreateUserFromTeacher::class)->execute($teacher);
        }

        return redirect()->back()->with('success', "Guru {$teacher->name} berhasil ditambahkan.");
    }

    public function update(TeacherRequest $request, Teacher $teacher): RedirectResponse
    {
        $data = $request->validated();
        unset($data['create_user']);

        if ($request->hasFile('photo_file')) {
            $path = $request->file('photo_file')->store('teachers', 'public');
            $data['photo'] = Storage::url($path);
        }
        unset($data['photo_file']);

        $teacher->update($data);

        return redirect()->back()->with('success', "Data guru {$teacher->name} berhasil diperbarui.");
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $name = $teacher->name;
        $teacher->delete();

        return redirect()->back()->with('success', "Guru {$name} berhasil dinonaktifkan (soft delete).");
    }

    public function generateUser(Teacher $teacher): RedirectResponse
    {
        app(CreateUserFromTeacher::class)->execute($teacher);

        return redirect()->back()->with('success', "Akun login untuk {$teacher->name} berhasil dibuat.");
    }

    public function togglePublic(Teacher $teacher): RedirectResponse
    {
        $teacher->update(['is_public' => ! $teacher->is_public]);

        $status = $teacher->is_public ? 'ditampilkan di website publik' : 'disembunyikan dari website publik';

        return redirect()->back()->with('success', "Status publik {$teacher->name} berhasil diperbarui: {$status}.");
    }

    public function import(ImportExcelRequest $request): RedirectResponse
    {
        $import = new TeachersImport;
        $import->import($request->file('file'));

        if ($import->failures()->isNotEmpty()) {
            $errors = [];
            foreach ($import->failures() as $failure) {
                $errors[] = "Baris {$failure->row()}: ".implode(', ', $failure->errors());
            }

            return redirect()->back()->with('error', 'Beberapa baris gagal diimpor: '.implode('; ', array_slice($errors, 0, 5)));
        }

        return redirect()->back()->with('success', 'Data guru berhasil diimpor dari Excel.');
    }
}
