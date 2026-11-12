<?php

namespace App\Actions\Academic;

use App\Models\Classroom;
use App\Models\Student;
use App\Models\StudentClassroom;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransferStudentClassroom
{
    /**
     * Transfer a student from their current active classroom to a target classroom.
     *
     * @throws ValidationException
     */
    public function execute(Student $student, Classroom $targetClassroom, ?string $notes = null): StudentClassroom
    {
        return DB::transaction(function () use ($student, $targetClassroom, $notes) {
            // 1. Check target classroom capacity
            $currentCount = StudentClassroom::where('classroom_id', $targetClassroom->id)
                ->where('status', 'active')
                ->count();

            if ($currentCount >= $targetClassroom->capacity) {
                throw ValidationException::withMessages([
                    'target_classroom_id' => "Kapasitas kelas tujuan {$targetClassroom->name} sudah penuh.",
                ]);
            }

            // 2. Find current active placement
            $activePlacement = StudentClassroom::where('student_id', $student->id)
                ->where('academic_year_id', $targetClassroom->academic_year_id)
                ->where('status', 'active')
                ->first();

            if ($activePlacement && $activePlacement->classroom_id === $targetClassroom->id) {
                return $activePlacement;
            }

            // 3. Mark old active placement as transferred
            if ($activePlacement) {
                $activePlacement->update([
                    'status' => 'transferred',
                    'transferred_at' => now(),
                    'notes' => $notes ?? "Mutasi/pindah ke kelas {$targetClassroom->name}",
                ]);
            }

            // 4. Create new active placement
            return StudentClassroom::create([
                'student_id' => $student->id,
                'classroom_id' => $targetClassroom->id,
                'academic_year_id' => $targetClassroom->academic_year_id,
                'status' => 'active',
                'notes' => $notes,
            ]);
        });
    }
}
