<?php

namespace App\Actions\Academic;

use App\Models\Classroom;
use App\Models\Teacher;
use Illuminate\Validation\ValidationException;

class AssignHomeroomTeacher
{
    /**
     * Assign a teacher as homeroom teacher to a classroom.
     * Enforces the business rule: 1 teacher can only be assigned to max 1 active classroom per academic year.
     *
     * @throws ValidationException
     */
    public function execute(Classroom $classroom, ?Teacher $teacher): Classroom
    {
        if ($teacher) {
            // Check if teacher is already assigned to another classroom in the same academic year
            $alreadyAssigned = Classroom::where('academic_year_id', $classroom->academic_year_id)
                ->where('id', '!=', $classroom->id)
                ->where('homeroom_teacher_id', $teacher->id)
                ->exists();

            if ($alreadyAssigned) {
                throw ValidationException::withMessages([
                    'homeroom_teacher_id' => "Guru {$teacher->name} sudah ditugaskan sebagai wali kelas di rombel lain pada tahun ajaran ini.",
                ]);
            }
        }

        $classroom->update([
            'homeroom_teacher_id' => $teacher?->id,
        ]);

        // If teacher has user account, ensure homeroom_teacher role is in sync
        if ($teacher && $teacher->user) {
            $teacher->user->assignRole('homeroom_teacher');
        }

        return $classroom->fresh(['homeroomTeacher']);
    }
}
