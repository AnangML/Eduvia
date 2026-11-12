<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles & Permissions
        $this->call(RolePermissionSeeder::class);

        // 2. Seed Default Settings
        $this->call(SettingSeeder::class);

        // 3. Seed Phase 1 Master Data
        $this->call(AcademicMasterSeeder::class);

        // 4. Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@eduvia.test'],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'phone_number' => '081234567890',
                'password' => bcrypt('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $superAdmin->assignRole('super_admin');

        // 5. Seed Phase 2 School Profile & Public Content
        $this->call(SchoolProfileSeeder::class);

        // 6. Seed Phase 3 PPDB Online
        $this->call(PpdbSeeder::class);
    }
}
