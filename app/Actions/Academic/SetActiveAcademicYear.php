<?php

namespace App\Actions\Academic;

use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class SetActiveAcademicYear
{
    /**
     * Activate the given academic year and optionally a specific semester.
     */
    public function execute(AcademicYear $academicYear, ?Semester $semester = null): AcademicYear
    {
        return DB::transaction(function () use ($academicYear, $semester) {
            // 1. Deactivate all other academic years
            AcademicYear::where('id', '!=', $academicYear->id)->update(['is_active' => false]);

            // 2. Activate this academic year
            $academicYear->update(['is_active' => true]);

            // 3. Handle semester activation
            if ($semester && $semester->academic_year_id === $academicYear->id) {
                Semester::where('academic_year_id', $academicYear->id)
                    ->where('id', '!=', $semester->id)
                    ->update(['is_active' => false]);

                $semester->update(['is_active' => true]);
                Setting::set('active_semester', (string) $semester->semester_number, 'academic', 'integer');
            }

            // 4. Update global settings
            Setting::set('active_academic_year', $academicYear->name, 'academic', 'string');

            return $academicYear->fresh(['semesters']);
        });
    }
}
