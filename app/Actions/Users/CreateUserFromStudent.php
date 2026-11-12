<?php

namespace App\Actions\Users;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateUserFromStudent
{
    /**
     * Create or link a User account for a Student.
     */
    public function execute(Student $student, ?string $customPassword = null): User
    {
        return DB::transaction(function () use ($student, $customPassword) {
            if ($student->user) {
                return $student->user;
            }

            // Default password based on choice 1A: DDMMYYYY or NISN
            $defaultPassword = $customPassword ?? ($student->birth_date ? $student->birth_date->format('dmY') : $student->nisn);
            $email = $student->nisn.'@student.eduvia.sch.id';

            $user = User::updateOrCreate(
                ['username' => $student->nisn],
                [
                    'name' => $student->full_name,
                    'email' => $email,
                    'phone_number' => $student->phone_number,
                    'password' => Hash::make($defaultPassword),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('student');

            $student->update(['user_id' => $user->id]);

            return $user;
        });
    }
}
