<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class PpdbRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'period_id' => ['required', 'exists:ppdb_periods,id'],
            'track_id' => ['required', 'exists:ppdb_tracks,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'second_department_id' => ['nullable', 'exists:departments,id', 'different:department_id'],

            // Identitas Calon Siswa
            'nisn' => ['required', 'string', 'size:10'],
            'nik' => ['required', 'string', 'size:16'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:L,P'],
            'birth_place' => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date', 'before:today'],
            'religion' => ['nullable', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:1000'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'village' => ['nullable', 'string', 'max:100'],
            'phone_number' => ['required', 'string', 'max:25'],
            'email' => ['nullable', 'email', 'max:255'],

            // Asal Sekolah & Nilai Rapor
            'previous_school_name' => ['required', 'string', 'max:255'],
            'previous_school_address' => ['nullable', 'string', 'max:500'],
            'graduation_year' => ['required', 'integer', 'min:2018', 'max:2030'],
            'average_report_score' => ['required', 'numeric', 'min:0', 'max:100'],

            // Data Orang Tua / Wali
            'father_name' => ['nullable', 'string', 'max:255'],
            'father_occupation' => ['nullable', 'string', 'max:100'],
            'father_phone' => ['nullable', 'string', 'max:25'],
            'mother_name' => ['nullable', 'string', 'max:255'],
            'mother_occupation' => ['nullable', 'string', 'max:100'],
            'mother_phone' => ['nullable', 'string', 'max:25'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_occupation' => ['nullable', 'string', 'max:100'],
            'guardian_phone' => ['nullable', 'string', 'max:25'],
            'parent_income' => ['nullable', 'string', 'max:50'],

            // Dokumen Berkas Persyaratan
            'photo_file' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'family_card_file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:4096'],
            'birth_cert_file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:4096'],
            'graduation_cert_file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:4096'],
            'achievement_cert_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
            'assistance_card_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:4096'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nisn.size' => 'NISN harus tepat 10 digit.',
            'nik.size' => 'NIK harus tepat 16 digit.',
            'second_department_id.different' => 'Pilihan program keahlian ke-2 tidak boleh sama dengan pilihan ke-1.',
            'photo_file.required' => 'Pas foto formal 3x4 wajib diunggah.',
            'family_card_file.required' => 'Scan/foto Kartu Keluarga (KK) wajib diunggah.',
            'birth_cert_file.required' => 'Scan/foto Akta Kelahiran wajib diunggah.',
            'graduation_cert_file.required' => 'Scan Ijazah / SKL / Rapor wajib diunggah.',
        ];
    }
}
