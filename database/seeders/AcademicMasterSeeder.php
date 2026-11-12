<?php

namespace Database\Seeders;

use App\Actions\Academic\AssignHomeroomTeacher;
use App\Actions\Academic\AssignStudentToClassroom;
use App\Actions\Academic\SetActiveAcademicYear;
use App\Actions\Users\CreateUserFromStudent;
use App\Actions\Users\CreateUserFromTeacher;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\GradeLevel;
use App\Models\Guardian;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use Illuminate\Database\Seeder;

class AcademicMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Academic Year & Semesters
        $academicYear = AcademicYear::firstOrCreate(
            ['name' => '2026/2027'],
            [
                'start_date' => '2026-07-15',
                'end_date' => '2027-06-20',
                'is_active' => true,
            ]
        );

        $semester1 = Semester::firstOrCreate(
            ['academic_year_id' => $academicYear->id, 'semester_number' => 1],
            ['name' => 'Ganjil', 'is_active' => true]
        );

        Semester::firstOrCreate(
            ['academic_year_id' => $academicYear->id, 'semester_number' => 2],
            ['name' => 'Genap', 'is_active' => false]
        );

        app(SetActiveAcademicYear::class)->execute($academicYear, $semester1);

        // 2. Grade Levels (X, XI, XII)
        $gradeLevels = [
            ['educational_level' => 'SMA/SMK', 'level_number' => 10, 'name' => 'Kelas X (Sepuluh)'],
            ['educational_level' => 'SMA/SMK', 'level_number' => 11, 'name' => 'Kelas XI (Sebelas)'],
            ['educational_level' => 'SMA/SMK', 'level_number' => 12, 'name' => 'Kelas XII (Dua Belas)'],
        ];

        foreach ($gradeLevels as $gl) {
            GradeLevel::firstOrCreate(
                ['educational_level' => $gl['educational_level'], 'level_number' => $gl['level_number']],
                $gl
            );
        }

        // 3. Departments (Choice 2C: Kombinasi SMA & SMK)
        $departments = [
            ['code' => 'RPL', 'name' => 'Rekayasa Perangkat Lunak', 'is_active' => true],
            ['code' => 'TKJ', 'name' => 'Teknik Komputer dan Jaringan', 'is_active' => true],
            ['code' => 'AKL', 'name' => 'Akuntansi dan Keuangan Lembaga', 'is_active' => true],
            ['code' => 'MIPA', 'name' => 'Matematika dan Ilmu Pengetahuan Alam', 'is_active' => true],
            ['code' => 'IPS', 'name' => 'Ilmu Pengetahuan Sosial', 'is_active' => true],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['code' => $dept['code']], $dept);
        }

        // 4. Teachers
        $teachersData = [
            [
                'nip' => '198005102005011002',
                'nuptk' => '3456789012345678',
                'name' => 'Budi Santoso, S.Kom., M.T.',
                'gender' => 'L',
                'phone_number' => '081234567801',
                'employment_status' => 'PNS',
            ],
            [
                'nip' => '198503152008012004',
                'nuptk' => '4567890123456789',
                'name' => 'Siti Aminah, S.Pd., M.Pd.',
                'gender' => 'P',
                'phone_number' => '081234567802',
                'employment_status' => 'PNS',
            ],
            [
                'nip' => '199008202015021003',
                'nuptk' => '5678901234567890',
                'name' => 'Eko Prasetyo, S.Si.',
                'gender' => 'L',
                'phone_number' => '081234567803',
                'employment_status' => 'PPPK',
            ],
            [
                'nip' => '199211052019032005',
                'nuptk' => '6789012345678901',
                'name' => 'Dewi Lestari, S.Pd.',
                'gender' => 'P',
                'phone_number' => '081234567804',
                'employment_status' => 'GTY',
            ],
        ];

        $teachers = [];
        foreach ($teachersData as $tData) {
            $teacher = Teacher::firstOrCreate(['nip' => $tData['nip']], $tData);
            // Create User Account automatically
            app(CreateUserFromTeacher::class)->execute($teacher);
            $teachers[] = $teacher;
        }

        // 5. Classrooms
        $grade10 = GradeLevel::where('level_number', 10)->first();
        $grade11 = GradeLevel::where('level_number', 11)->first();
        $deptRpl = Department::where('code', 'RPL')->first();
        $deptTkj = Department::where('code', 'TKJ')->first();
        $deptMipa = Department::where('code', 'MIPA')->first();

        $classroomsData = [
            [
                'academic_year_id' => $academicYear->id,
                'grade_level_id' => $grade10->id,
                'department_id' => $deptRpl->id,
                'name' => 'X RPL 1',
                'capacity' => 36,
                'homeroom_teacher_id' => $teachers[0]->id,
            ],
            [
                'academic_year_id' => $academicYear->id,
                'grade_level_id' => $grade10->id,
                'department_id' => $deptTkj->id,
                'name' => 'X TKJ 1',
                'capacity' => 36,
                'homeroom_teacher_id' => $teachers[1]->id,
            ],
            [
                'academic_year_id' => $academicYear->id,
                'grade_level_id' => $grade11->id,
                'department_id' => $deptMipa->id,
                'name' => 'XI MIPA 1',
                'capacity' => 34,
                'homeroom_teacher_id' => $teachers[2]->id,
            ],
        ];

        $classrooms = [];
        foreach ($classroomsData as $cData) {
            $classroom = Classroom::firstOrCreate(
                ['academic_year_id' => $cData['academic_year_id'], 'name' => $cData['name']],
                $cData
            );
            // Assign homeroom teacher with validation
            $teacher = Teacher::find($cData['homeroom_teacher_id']);
            app(AssignHomeroomTeacher::class)->execute($classroom, $teacher);
            $classrooms[] = $classroom;
        }

        // 6. Subjects
        $subjectsData = [
            ['code' => 'PAB-X', 'name' => 'Pendidikan Agama & Budi Pekerti', 'group' => 'Umum', 'kkm_score' => 75],
            ['code' => 'BIN-X', 'name' => 'Bahasa Indonesia', 'group' => 'Umum', 'kkm_score' => 75],
            ['code' => 'BIG-X', 'name' => 'Bahasa Inggris', 'group' => 'Umum', 'kkm_score' => 75],
            ['code' => 'MAT-X', 'name' => 'Matematika Terapan', 'group' => 'Umum', 'kkm_score' => 70],
            ['code' => 'PWEB-X', 'name' => 'Pemrograman Web dan Perangkat Bergerak', 'group' => 'Kejuruan', 'kkm_score' => 78],
            ['code' => 'BD-X', 'name' => 'Basis Data & SQL', 'group' => 'Kejuruan', 'kkm_score' => 75],
            ['code' => 'AIJ-X', 'name' => 'Administrasi Infrastruktur Jaringan', 'group' => 'Kejuruan', 'kkm_score' => 75],
        ];

        $subjects = [];
        foreach ($subjectsData as $sData) {
            $subject = Subject::firstOrCreate(['code' => $sData['code']], $sData);
            $subjects[] = $subject;
        }

        // 7. Teaching Assignments
        // Teacher 0 (Budi) teaches PWEB-X in X RPL 1
        TeachingAssignment::firstOrCreate([
            'teacher_id' => $teachers[0]->id,
            'subject_id' => $subjects[4]->id,
            'classroom_id' => $classrooms[0]->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester1->id,
        ]);

        // Teacher 1 (Siti) teaches Bahasa Indonesia in X RPL 1 and X TKJ 1
        TeachingAssignment::firstOrCreate([
            'teacher_id' => $teachers[1]->id,
            'subject_id' => $subjects[1]->id,
            'classroom_id' => $classrooms[0]->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester1->id,
        ]);
        TeachingAssignment::firstOrCreate([
            'teacher_id' => $teachers[1]->id,
            'subject_id' => $subjects[1]->id,
            'classroom_id' => $classrooms[1]->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester1->id,
        ]);

        // 8. Sample Students and Guardians
        $studentsData = [
            [
                'nisn' => '0081234561',
                'nis' => '20261001',
                'nik' => '3171010101080001',
                'full_name' => 'Ahmad Fauzan Pratama',
                'gender' => 'L',
                'birth_place' => 'Jakarta',
                'birth_date' => '2008-04-12',
                'phone_number' => '085612345001',
                'address' => 'Jl. Tebet Barat No. 12, Jakarta Selatan',
            ],
            [
                'nisn' => '0081234562',
                'nis' => '20261002',
                'nik' => '3171010101080002',
                'full_name' => 'Nabila Putri Cahyani',
                'gender' => 'P',
                'birth_place' => 'Bandung',
                'birth_date' => '2008-08-25',
                'phone_number' => '085612345002',
                'address' => 'Jl. Melati Putih No. 5, Jakarta Selatan',
            ],
            [
                'nisn' => '0081234563',
                'nis' => '20261003',
                'nik' => '3171010101080003',
                'full_name' => 'Rizky Ramadhani',
                'gender' => 'L',
                'birth_place' => 'Bogor',
                'birth_date' => '2008-09-18',
                'phone_number' => '085612345003',
                'address' => 'Jl. Cilandak Permai No. 8, Jakarta Selatan',
            ],
        ];

        // Sample Guardian
        $guardian = Guardian::firstOrCreate(
            ['nik' => '3171010101750001'],
            [
                'name' => 'H. Bambang Sulistyo',
                'relationship_type' => 'father',
                'phone_number' => '081198765432',
                'occupation' => 'Wiraswasta',
                'address' => 'Jl. Tebet Barat No. 12, Jakarta Selatan',
            ]
        );

        foreach ($studentsData as $stData) {
            $student = Student::firstOrCreate(['nisn' => $stData['nisn']], $stData);
            // Create User Account automatically
            app(CreateUserFromStudent::class)->execute($student);
            // Assign to classroom X RPL 1
            app(AssignStudentToClassroom::class)->execute($student, $classrooms[0]);

            // Link to Guardian (Bambang is father of Ahmad and Nabila)
            if (in_array($student->nisn, ['0081234561', '0081234562'])) {
                $guardian->students()->syncWithoutDetaching([
                    $student->id => ['relationship' => 'father', 'is_emergency_contact' => true],
                ]);
            }
        }
    }
}
