<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define all permissions based on docs/ROLES_PERMISSIONS.md
        $permissions = [
            // System & Settings
            'manage_settings',
            'manage_users_roles',
            'view_audit_logs',

            // Academic Master Data
            'manage_academic_years',
            'manage_classrooms',
            'manage_teachers',
            'manage_students',
            'manage_guardians',
            'manage_subjects',
            'manage_teaching_assignments',
            'view_master_data',

            // School Profile & CMS
            'manage_school_profile',
            'manage_announcements',

            // PPDB
            'manage_ppdb_periods',
            'verify_ppdb_applicants',
            'submit_ppdb_application',

            // Attendance
            'record_daily_attendance',
            'record_subject_attendance',
            'view_own_attendance',
            'view_all_attendance_reports',

            // Grading & Report Card
            'input_student_grades',
            'validate_class_report_card',
            'publish_report_card',
            'unlock_published_report_card',
            'view_own_report_card',
            'view_all_grade_reports',

            // SSP / Financial
            'manage_payment_categories',
            'generate_bills',
            'record_manual_payment',
            'verify_transfer_payment',
            'pay_via_midtrans',
            'view_own_bills',
            'view_financial_reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Refresh cache so permissions are loaded
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Define all 8 roles
        $roles = [
            'super_admin' => $permissions, // Super admin gets all permissions
            'admin' => [
                'manage_academic_years',
                'manage_classrooms',
                'manage_teachers',
                'manage_students',
                'manage_guardians',
                'manage_subjects',
                'manage_teaching_assignments',
                'view_master_data',
                'manage_school_profile',
                'manage_announcements',
                'manage_ppdb_periods',
                'verify_ppdb_applicants',
                'record_daily_attendance',
                'record_subject_attendance',
                'view_all_attendance_reports',
                'publish_report_card',
                'view_all_grade_reports',
                'manage_payment_categories',
                'generate_bills',
                'record_manual_payment',
                'verify_transfer_payment',
                'view_financial_reports',
            ],
            'principal' => [
                'view_master_data',
                'view_all_attendance_reports',
                'view_all_grade_reports',
                'view_financial_reports',
            ],
            'teacher' => [
                'view_master_data',
                'record_subject_attendance',
                'input_student_grades',
            ],
            'homeroom_teacher' => [
                'view_master_data',
                'record_daily_attendance',
                'record_subject_attendance',
                'input_student_grades',
                'validate_class_report_card',
            ],
            'student' => [
                'view_own_attendance',
                'view_own_report_card',
                'view_own_bills',
                'pay_via_midtrans',
            ],
            'guardian' => [
                'view_own_attendance',
                'view_own_report_card',
                'view_own_bills',
                'pay_via_midtrans',
            ],
            'prospective_student' => [
                'submit_ppdb_application',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($rolePermissions);
        }
    }
}
