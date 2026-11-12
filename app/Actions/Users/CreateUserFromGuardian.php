<?php

namespace App\Actions\Users;

use App\Models\Guardian;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateUserFromGuardian
{
    /**
     * Create or link a User account for a Guardian.
     */
    public function execute(Guardian $guardian, ?string $customPassword = null): User
    {
        return DB::transaction(function () use ($guardian, $customPassword) {
            if ($guardian->user) {
                return $guardian->user;
            }

            $username = $guardian->phone_number ?? ($guardian->nik ?? 'guardian_'.Str::random(6));
            $defaultPassword = $customPassword ?? ($guardian->phone_number ?? 'WaliEduvia#2026');
            $email = Str::lower(Str::slug($guardian->name, '.'))."{$guardian->id}@guardian.eduvia.sch.id";

            $user = User::updateOrCreate(
                ['username' => $username],
                [
                    'name' => $guardian->name,
                    'email' => $email,
                    'phone_number' => $guardian->phone_number,
                    'password' => Hash::make($defaultPassword),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('guardian');

            $guardian->update(['user_id' => $user->id]);

            return $user;
        });
    }
}
