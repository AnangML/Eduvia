<?php

namespace App\Actions\Users;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateUserFromTeacher
{
    /**
     * Create or link a User account for a Teacher.
     */
    public function execute(Teacher $teacher, ?string $customPassword = null): User
    {
        return DB::transaction(function () use ($teacher, $customPassword) {
            if ($teacher->user) {
                return $teacher->user;
            }

            $username = $teacher->nip ?? Str::lower(Str::slug($teacher->name, ''));
            $defaultPassword = $customPassword ?? ($teacher->nip ?? 'GuruEduvia#2026');
            $email = Str::lower(Str::slug($teacher->name, '.')).'@teacher.eduvia.sch.id';

            // Ensure unique email
            $count = User::where('email', $email)->count();
            if ($count > 0) {
                $email = Str::lower(Str::slug($teacher->name, '.'))."{$teacher->id}@teacher.eduvia.sch.id";
            }

            $user = User::updateOrCreate(
                ['username' => $username],
                [
                    'name' => $teacher->name,
                    'email' => $email,
                    'phone_number' => $teacher->phone_number,
                    'password' => Hash::make($defaultPassword),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('teacher');

            if ($teacher->currentHomeroomClassroom()->exists()) {
                $user->assignRole('homeroom_teacher');
            }

            $teacher->update(['user_id' => $user->id]);

            return $user;
        });
    }
}
