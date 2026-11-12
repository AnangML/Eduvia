<?php

namespace App\Actions\Academic;

use App\Models\Classroom;
use App\Models\Student;
use App\Models\StudentClassroom;
use Illuminate\Validation\ValidationException;

class AssignStudentToClassroom
{
    /**
     * Assign a student to a classroom for the academic year.
     *
     * @throws ValidationException
     */
    public function execute(Student $student, Classroom $classroom): StudentClassroom
    {
        // 1. Check classroom capacity
        $currentCount = StudentClassroom::where('classroom_id', $classroom->id)
            ->where('status', 'active')
            ->count();

        if ($currentCount >= $classroom->capacity) {
            throw ValidationException::withMessages([
                'classroom_id' => "Kapasitas kelas {$classroom->name} sudah penuh ({$classroom->capacity} siswa).",
            ]);
        }

        // 2. Check if student already has an active classroom in this academic year
        $existing = StudentClassroom::where('student_id', $student->id)
            ->where('academic_year_id', $classroom->academic_year_id)
            ->where('status', 'active')
            ->first();

        if ($existing) {
            if ($existing->classroom_id === $classroom->id) {
                return $existing;
            }

            throw ValidationException::withMessages([
                'student_id' => "Siswa {$student->full_name} sudah terdaftar di kelas lain pada tahun ajaran ini. Gunakan fitur mutasi/pindah kelas.",
            ]);
        }

        return StudentClassroom::create([
            'student_id' => $student->id,
            'classroom_id' => $classroom->id,
            'academic_year_id' => $classroom->academic_year_id,
            'status' => 'active',
        ]);
    }
}
