<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultSettings = [
            [
                'key' => 'school_name',
                'value' => 'SMK Eduvia Nusantara',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'school_level',
                'value' => 'SMK',
                'group' => 'academic',
                'type' => 'string',
            ],
            [
                'key' => 'school_address',
                'value' => 'Jl. Pendidikan Merdeka No. 45, Jakarta',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'school_phone',
                'value' => '(021) 7890-1234',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'school_email',
                'value' => 'admin@eduvia.sch.id',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'school_principal_name',
                'value' => 'Drs. H. Ahmad Dahlan, M.Pd.',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'school_principal_nip',
                'value' => '197501012000031001',
                'group' => 'general',
                'type' => 'string',
            ],
            [
                'key' => 'active_academic_year',
                'value' => '2026/2027',
                'group' => 'academic',
                'type' => 'string',
            ],
            [
                'key' => 'active_semester',
                'value' => '1',
                'group' => 'academic',
                'type' => 'integer',
            ],
        ];

        foreach ($defaultSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
