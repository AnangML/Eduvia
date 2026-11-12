<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\TeachingAssignmentRequest;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeachingAssignmentController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::active()->first() ?? AcademicYear::latest()->first();
        $selectedYearId = $request->input('academic_year_id', $activeYear?->id);

        $activeSemester = Semester::where('academic_year_id', $selectedYearId)->where('is_active', true)->first()
            ?? Semester::where('academic_year_id', $selectedYearId)->first();
        $selectedSemesterId = $request->input('semester_id', $activeSemester?->id);

        $assignments = TeachingAssignment::with(['teacher', 'subject', 'classroom'])
            ->where('academic_year_id', $selectedYearId)
            ->where('semester_id', $selectedSemesterId)
            ->get();

        $academicYears = AcademicYear::orderByDesc('name')->get();
        $semesters = Semester::where('academic_year_id', $selectedYearId)->orderBy('semester_number')->get();
        $teachers = Teacher::where('is_active', true)->orderBy('name')->get();
        $subjects = Subject::where('is_active', true)->orderBy('name')->get();
        $classrooms = Classroom::where('academic_year_id', $selectedYearId)->orderBy('name')->get();

        return Inertia::render('Academic/TeachingAssignments/Index', [
            'assignments' => $assignments,
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'teachers' => $teachers,
            'subjects' => $subjects,
            'classrooms' => $classrooms,
            'selectedYearId' => (int) $selectedYearId,
            'selectedSemesterId' => (int) $selectedSemesterId,
        ]);
    }

    public function store(TeachingAssignmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $academicYear = AcademicYear::active()->first();
        $data['academic_year_id'] = $academicYear?->id;

        // Check duplicate
        $exists = TeachingAssignment::where('classroom_id', $data['classroom_id'])
            ->where('subject_id', $data['subject_id'])
            ->where('semester_id', $data['semester_id'])
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Mata pelajaran ini sudah ditugaskan ke guru lain di rombel dan semester yang sama.');
        }

        TeachingAssignment::create($data);

        return redirect()->back()->with('success', 'Penugasan mengajar berhasil ditambahkan.');
    }

    public function destroy(TeachingAssignment $teachingAssignment): RedirectResponse
    {
        $teachingAssignment->delete();

        return redirect()->back()->with('success', 'Penugasan mengajar berhasil dihapus.');
    }
}
