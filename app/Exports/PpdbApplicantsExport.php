<?php

namespace App\Exports;

use App\Models\PpdbApplicant;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PpdbApplicantsExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(
        protected ?int $periodId = null,
        protected ?int $trackId = null,
        protected ?string $verificationStatus = null,
        protected ?string $selectionStatus = null,
    ) {}

    public function collection(): Enumerable
    {
        return PpdbApplicant::with(['period', 'track', 'department', 'secondDepartment'])
            ->when($this->periodId, fn ($q) => $q->where('period_id', $this->periodId))
            ->when($this->trackId, fn ($q) => $q->where('track_id', $this->trackId))
            ->when($this->verificationStatus, fn ($q) => $q->where('verification_status', $this->verificationStatus))
            ->when($this->selectionStatus, fn ($q) => $q->where('selection_status', $this->selectionStatus))
            ->orderBy('ranking', 'asc')
            ->orderByDesc('final_score')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No. Registrasi',
            'NISN',
            'NIK',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'No. Telepon/WA',
            'Alamat',
            'Kecamatan',
            'Kota/Kabupaten',
            'Provinsi',
            'Skor Zonasi',
            'Rata-rata Rapor',
            'Total Skor Akhir',
            'Peringkat',
            'Jalur',
            'Pilihan 1',
            'Pilihan 2',
            'Sekolah Asal',
            'Status Verifikasi',
            'Status Seleksi',
            'Daftar Ulang',
            'Tanggal Daftar',
        ];
    }

    /**
     * @param  PpdbApplicant  $applicant
     */
    public function map($applicant): array
    {
        return [
            $applicant->registration_number,
            $applicant->nisn,
            $applicant->nik,
            $applicant->full_name,
            $applicant->gender === 'L' ? 'Laki-laki' : 'Perempuan',
            $applicant->birth_place,
            $applicant->birth_date?->format('d/m/Y'),
            $applicant->phone_number,
            $applicant->address,
            $applicant->district,
            $applicant->city,
            $applicant->province,
            $applicant->distance_zone_score,
            $applicant->average_report_score,
            $applicant->final_score,
            $applicant->ranking ?? '-',
            $applicant->track?->name ?? '-',
            $applicant->department?->name ?? '-',
            $applicant->secondDepartment?->name ?? '-',
            $applicant->previous_school_name,
            $applicant->verification_status,
            $applicant->selection_status,
            $applicant->re_registration_status,
            $applicant->created_at?->format('d/m/Y H:i'),
        ];
    }
}
