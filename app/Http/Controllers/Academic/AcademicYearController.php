<?php

namespace App\Http\Controllers\Academic;

use App\Actions\Academic\SetActiveAcademicYear;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\AcademicYearRequest;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\GradeLevel;
use App\Models\Semester;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    public function index(): Response
    {
        $academicYears = AcademicYear::with('semesters')
            ->orderByDesc('name')
            ->get();

        $gradeLevels = GradeLevel::orderBy('level_number')->get();
        $departments = Department::orderBy('code')->get();

        return Inertia::render('Academic/AcademicYears/Index', [
            'academicYears' => $academicYears,
            'gradeLevels' => $gradeLevels,
            'departments' => $departments,
        ]);
    }

    public function store(AcademicYearRequest $request): RedirectResponse
    {
        $academicYear = AcademicYear::create($request->validated());

        // Create default Ganjil and Genap semesters
        Semester::create([
            'academic_year_id' => $academicYear->id,
            'semester_number' => 1,
            'name' => 'Ganjil',
            'is_active' => $request->boolean('is_active'),
        ]);

        Semester::create([
            'academic_year_id' => $academicYear->id,
            'semester_number' => 2,
            'name' => 'Genap',
            'is_active' => false,
        ]);

        if ($request->boolean('is_active')) {
            $sem1 = $academicYear->semesters()->where('semester_number', 1)->first();
            app(SetActiveAcademicYear::class)->execute($academicYear, $sem1);
        }

        return redirect()->back()->with('success', 'Tahun ajaran berhasil ditambahkan.');
    }

    public function setActive(Request $request, AcademicYear $academicYear, SetActiveAcademicYear $action): RedirectResponse
    {
        $semester = null;
        if ($request->has('semester_id')) {
            $semester = Semester::find($request->input('semester_id'));
        }

        $action->execute($academicYear, $semester);

        return redirect()->back()->with('success', "Tahun ajaran {$academicYear->name} sekarang aktif.");
    }
}
