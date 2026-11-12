<?php

namespace Tests\Feature;

use App\Imports\StudentsImport;
use App\Imports\TeachersImport;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\GradeLevel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExcelImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_teachers_import_validates_and_creates_records(): void
    {
        $import = new TeachersImport;

        // Valid row
        $model = $import->model([
            'nama' => 'Guru Sukses',
            'nip' => '199501012020011001',
            'nuptk' => '1234567890123456',
            'jenis_kelamin' => 'L',
            'status_kepegawaian' => 'PNS',
            'no_telepon' => '08123456789',
        ]);

        $this->assertNotNull($model);
        $this->assertEquals('Guru Sukses', $model->name);
        $this->assertEquals('199501012020011001', $model->nip);
    }

    public function test_students_import_creates_student_and_assigns_classroom(): void
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

        $classroom = Classroom::create([
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'X RPL 1',
            'capacity' => 36,
        ]);

        $import = new StudentsImport($year->id);

        $student = $import->model([
            'nisn' => '0085555001',
            'nis' => '1001',
            'nama_lengkap' => 'Bintang Pratama',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '2008-01-15',
            'kelas' => 'X RPL 1',
        ]);

        $this->assertNotNull($student);
        $this->assertDatabaseHas('students', ['nisn' => '0085555001']);
        $this->assertDatabaseHas('student_classrooms', [
            'student_id' => $student->id,
            'classroom_id' => $classroom->id,
            'status' => 'active',
        ]);
    }
}
