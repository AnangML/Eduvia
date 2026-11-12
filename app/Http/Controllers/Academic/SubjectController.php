<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\SubjectRequest;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $subjects = Subject::when($search, function ($query, $search) {
            $query->where('name', 'ilike', "%{$search}%")
                ->orWhere('code', 'ilike', "%{$search}%");
        })
            ->orderBy('group')
            ->orderBy('name')
            ->get();

        return Inertia::render('Academic/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(SubjectRequest $request): RedirectResponse
    {
        $subject = Subject::create($request->validated());

        return redirect()->back()->with('success', "Mata pelajaran {$subject->name} berhasil ditambahkan.");
    }

    public function update(SubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());

        return redirect()->back()->with('success', "Mata pelajaran {$subject->name} berhasil diperbarui.");
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $name = $subject->name;
        $subject->delete();

        return redirect()->back()->with('success', "Mata pelajaran {$name} berhasil dinonaktifkan.");
    }
}
