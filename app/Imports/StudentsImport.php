<?php

namespace App\Imports;

use App\Actions\Academic\AssignStudentToClassroom;
use App\Models\Classroom;
use App\Models\Student;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements SkipsOnFailure, ToModel, WithHeadingRow, WithValidation
{
    use Importable, SkipsFailures;

    public function __construct(public ?int $academicYearId = null) {}

    /**
     * @param  array<string, mixed>  $row
     */
    public function model(array $row): ?Student
    {
        $birthDate = null;
        $rawDate = $row['tanggal_lahir'] ?? $row['birth_date'] ?? null;
        if (! empty($rawDate)) {
            try {
                $birthDate = Carbon::parse($rawDate)->toDateString();
            } catch (\Exception) {
                $birthDate = null;
            }
        }

        $student = Student::create([
            'nisn' => (string) ($row['nisn'] ?? ''),
            'nis' => ! empty($row['nis']) ? (string) $row['nis'] : null,
            'nik' => ! empty($row['nik']) ? (string) $row['nik'] : null,
            'full_name' => $row['nama_lengkap'] ?? $row['full_name'] ?? $row['nama'] ?? '',
            'gender' => strtoupper(trim((string) ($row['jenis_kelamin'] ?? $row['gender'] ?? 'L'))),
            'birth_place' => $row['tempat_lahir'] ?? $row['birth_place'] ?? null,
            'birth_date' => $birthDate,
            'phone_number' => ! empty($row['no_telepon']) ? (string) $row['no_telepon'] : ($row['phone'] ?? null),
            'address' => $row['alamat'] ?? $row['address'] ?? null,
            'status' => 'active',
        ]);

        // If classroom name is provided and academic year is specified, assign student
        $classroomName = $row['kelas'] ?? $row['classroom'] ?? null;
        if ($classroomName && $this->academicYearId) {
            $classroom = Classroom::where('academic_year_id', $this->academicYearId)
                ->where('name', $classroomName)
                ->first();

            if ($classroom) {
                try {
                    app(AssignStudentToClassroom::class)->execute($student, $classroom);
                } catch (\Exception) {
                    // Handled gracefully
                }
            }
        }

        return $student;
    }

    /**
     * @return array<string, array<string>>
     */
    public function rules(): array
    {
        return [
            '*.nisn' => ['required', 'unique:students,nisn'],
            '*.nama_lengkap' => ['required_without_all:*.full_name,*.nama', 'nullable', 'string'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function customValidationMessages(): array
    {
        return [
            '*.nisn.required' => 'Kolom NISN wajib diisi pada baris :attribute.',
            '*.nisn.unique' => 'NISN :input sudah terdaftar pada siswa lain.',
        ];
    }
}
