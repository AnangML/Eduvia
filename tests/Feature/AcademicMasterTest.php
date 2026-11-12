<?php

namespace Tests\Feature;

use App\Actions\Academic\AssignHomeroomTeacher;
use App\Actions\Academic\SetActiveAcademicYear;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\GradeLevel;
use App\Models\Semester;
use App\Models\Setting;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AcademicMasterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_can_set_active_academic_year_and_semester(): void
    {
        $year1 = AcademicYear::create([
            'name' => '2025/2026',
            'start_date' => '2025-07-01',
            'end_date' => '2026-06-30',
            'is_active' => true,
        ]);

        $year2 = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => false,
        ]);

        $sem1 = Semester::create([
            'academic_year_id' => $year2->id,
            'semester_number' => 1,
            'name' => 'Ganjil',
            'is_active' => false,
        ]);

        app(SetActiveAcademicYear::class)->execute($year2, $sem1);

        $this->assertFalse($year1->fresh()->is_active);
        $this->assertTrue($year2->fresh()->is_active);
        $this->assertTrue($sem1->fresh()->is_active);
        $this->assertEquals('2026/2027', Setting::get('active_academic_year'));
    }

    public function test_can_assign_homeroom_teacher_to_classroom(): void
    {
        $year = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => true,
        ]);

        $grade = GradeLevel::create([
            'educational_level' => 'SMA/SMK',
            'level_number' => 10,
            'name' => 'Kelas X',
        ]);

        $user = User::factory()->create();
        $user->assignRole('teacher');

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'nip' => '198001012000011001',
            'name' => 'Pak Guru Budi',
            'gender' => 'L',
            'employment_status' => 'PNS',
        ]);

        $classroom = Classroom::create([
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'X RPL 1',
            'capacity' => 36,
        ]);

        app(AssignHomeroomTeacher::class)->execute($classroom, $teacher);

        $this->assertEquals($teacher->id, $classroom->fresh()->homeroom_teacher_id);
        $this->assertTrue($user->fresh()->hasRole('homeroom_teacher'));
    }

    public function test_cannot_assign_same_teacher_as_homeroom_to_multiple_classrooms_in_same_year(): void
    {
        $year = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => true,
        ]);

        $grade = GradeLevel::create([
            'educational_level' => 'SMA/SMK',
            'level_number' => 10,
            'name' => 'Kelas X',
        ]);

        $teacher = Teacher::create([
            'nip' => '198001012000011002',
            'name' => 'Pak Guru Eko',
            'gender' => 'L',
            'employment_status' => 'PNS',
        ]);

        $classroom1 = Classroom::create([
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'X RPL 1',
            'capacity' => 36,
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $classroom2 = Classroom::create([
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'X RPL 2',
            'capacity' => 36,
        ]);

        $this->expectException(ValidationException::class);

        // Should throw validation exception because teacher is already homeroom in classroom1
        app(AssignHomeroomTeacher::class)->execute($classroom2, $teacher);
    }
}
