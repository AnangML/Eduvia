<?php

namespace Tests\Feature;

use App\Actions\Users\CreateUserFromGuardian;
use App\Actions\Users\CreateUserFromStudent;
use App\Actions\Users\CreateUserFromTeacher;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\Teacher;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_can_generate_user_from_student_with_birth_date_password(): void
    {
        $student = Student::create([
            'nisn' => '0087777001',
            'full_name' => 'Dimas Anggara',
            'gender' => 'L',
            'birth_date' => '2008-05-20',
        ]);

        $user = app(CreateUserFromStudent::class)->execute($student);

        $this->assertEquals('0087777001', $user->username);
        $this->assertTrue($user->hasRole('student'));
        $this->assertEquals($user->id, $student->fresh()->user_id);
        // Default password for choice 1A: 20052008 (dmY)
        $this->assertTrue(Hash::check('20052008', $user->password));
    }

    public function test_can_generate_user_from_teacher_with_nip_password(): void
    {
        $teacher = Teacher::create([
            'nip' => '198501012010011005',
            'name' => 'Ibu Guru Ratna',
            'gender' => 'P',
            'employment_status' => 'PNS',
        ]);

        $user = app(CreateUserFromTeacher::class)->execute($teacher);

        $this->assertEquals('198501012010011005', $user->username);
        $this->assertTrue($user->hasRole('teacher'));
        $this->assertEquals($user->id, $teacher->fresh()->user_id);
        $this->assertTrue(Hash::check('198501012010011005', $user->password));
    }

    public function test_can_generate_user_from_guardian(): void
    {
        $guardian = Guardian::create([
            'nik' => '3171010101700005',
            'name' => 'Pak Joko',
            'relationship_type' => 'father',
            'phone_number' => '081299998888',
        ]);

        $user = app(CreateUserFromGuardian::class)->execute($guardian);

        $this->assertEquals('081299998888', $user->username);
        $this->assertTrue($user->hasRole('guardian'));
        $this->assertEquals($user->id, $guardian->fresh()->user_id);
    }
}
