<?php

namespace Tests\Feature;

use App\Actions\Academic\AssignStudentToClassroom;
use App\Actions\Academic\TransferStudentClassroom;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\GradeLevel;
use App\Models\Student;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class StudentClassroomTest extends TestCase
{
    use RefreshDatabase;

    protected AcademicYear $year;

    protected GradeLevel $grade;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->year = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => true,
        ]);

        $this->grade = GradeLevel::create([
            'educational_level' => 'SMA/SMK',
            'level_number' => 10,
            'name' => 'Kelas X',
        ]);
    }

    public function test_can_assign_student_to_classroom(): void
    {
        $student = Student::create([
            'nisn' => '0089999001',
            'full_name' => 'Fajar Nugraha',
            'gender' => 'L',
        ]);

        $classroom = Classroom::create([
            'academic_year_id' => $this->year->id,
            'grade_level_id' => $this->grade->id,
            'name' => 'X RPL 1',
            'capacity' => 36,
        ]);

        $placement = app(AssignStudentToClassroom::class)->execute($student, $classroom);

        $this->assertEquals('active', $placement->status);
        $this->assertEquals($classroom->id, $placement->classroom_id);
    }

    public function test_cannot_assign_student_when_classroom_is_full(): void
    {
        $classroom = Classroom::create([
            'academic_year_id' => $this->year->id,
            'grade_level_id' => $this->grade->id,
            'name' => 'X RPL 1',
            'capacity' => 1, // capacity is 1
        ]);

        $student1 = Student::create(['nisn' => '0089999002', 'full_name' => 'Siswa 1', 'gender' => 'L']);
        $student2 = Student::create(['nisn' => '0089999003', 'full_name' => 'Siswa 2', 'gender' => 'P']);

        app(AssignStudentToClassroom::class)->execute($student1, $classroom);

        $this->expectException(ValidationException::class);

        // Attempting to assign student2 should fail due to capacity
        app(AssignStudentToClassroom::class)->execute($student2, $classroom);
    }

    public function test_can_transfer_student_to_another_classroom(): void
    {
        $classroom1 = Classroom::create([
            'academic_year_id' => $this->year->id,
            'grade_level_id' => $this->grade->id,
            'name' => 'X RPL 1',
            'capacity' => 36,
        ]);

        $classroom2 = Classroom::create([
            'academic_year_id' => $this->year->id,
            'grade_level_id' => $this->grade->id,
            'name' => 'X TKJ 1',
            'capacity' => 36,
        ]);

        $student = Student::create(['nisn' => '0089999004', 'full_name' => 'Siswa Mutasi', 'gender' => 'L']);

        // First assignment
        $oldPlacement = app(AssignStudentToClassroom::class)->execute($student, $classroom1);
        $this->assertEquals('active', $oldPlacement->status);

        // Mutasi ke classroom2
        $newPlacement = app(TransferStudentClassroom::class)->execute($student, $classroom2, 'Pindah minat ke TKJ');

        $this->assertEquals('transferred', $oldPlacement->fresh()->status);
        $this->assertNotNull($oldPlacement->fresh()->transferred_at);
        $this->assertEquals('active', $newPlacement->status);
        $this->assertEquals($classroom2->id, $newPlacement->classroom_id);
    }
}
