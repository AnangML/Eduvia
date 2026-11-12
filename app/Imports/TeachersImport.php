<?php

namespace App\Imports;

use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TeachersImport implements SkipsOnFailure, ToModel, WithHeadingRow, WithValidation
{
    use Importable, SkipsFailures;

    /**
     * @param  array<string, mixed>  $row
     */
    public function model(array $row): ?Teacher
    {
        return new Teacher([
            'name' => $row['nama'] ?? $row['name'],
            'nip' => ! empty($row['nip']) ? (string) $row['nip'] : null,
            'nuptk' => ! empty($row['nuptk']) ? (string) $row['nuptk'] : null,
            'gender' => strtoupper(trim((string) ($row['jenis_kelamin'] ?? $row['gender'] ?? 'L'))),
            'phone_number' => ! empty($row['no_telepon']) ? (string) $row['no_telepon'] : ($row['phone'] ?? null),
            'address' => $row['alamat'] ?? $row['address'] ?? null,
            'employment_status' => $row['status_kepegawaian'] ?? $row['employment_status'] ?? 'PNS',
            'is_active' => true,
        ]);
    }

    /**
     * @return array<string, array<string>>
     */
    public function rules(): array
    {
        return [
            '*.nama' => ['required_without:*.name', 'nullable', 'string'],
            '*.name' => ['required_without:*.nama', 'nullable', 'string'],
            '*.nip' => ['nullable', 'unique:teachers,nip'],
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
            '*.nama.required_without' => 'Kolom nama guru wajib diisi pada baris :attribute.',
            '*.nip.unique' => 'NIP :input sudah terdaftar pada guru lain.',
        ];
    }
}
