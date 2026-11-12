<?php

namespace App\Actions\Ppdb;

use App\Actions\Audit\RecordAuditLog;
use App\Models\PpdbApplicant;
use App\Models\PpdbDocument;
use App\Models\PpdbPeriod;
use App\Models\PpdbTrack;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class RegisterApplicant
{
    public function __construct(
        protected CalculateZoneScore $calculator,
        protected RecordAuditLog $auditLogger,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, UploadedFile|null>  $files
     */
    public function execute(array $data, array $files = []): PpdbApplicant
    {
        $period = PpdbPeriod::findOrFail($data['period_id']);
        if (! $period->isOpen()) {
            throw ValidationException::withMessages([
                'period_id' => 'Periode PPDB ini sedang ditutup atau belum aktif.',
            ]);
        }

        // Check duplicate NISN or NIK in the same period
        $duplicate = PpdbApplicant::where('period_id', $period->id)
            ->where(function ($query) use ($data) {
                $query->where('nisn', $data['nisn'])
                    ->orWhere('nik', $data['nik']);
            })
            ->exists();

        if ($duplicate) {
            throw ValidationException::withMessages([
                'nisn' => 'Calon siswa dengan NISN atau NIK ini sudah pernah mendaftar pada periode gelombang ini.',
            ]);
        }

        $track = PpdbTrack::findOrFail($data['track_id']);

        // Calculate scores
        $averageReport = isset($data['average_report_score']) ? (float) $data['average_report_score'] : 0.0;
        $scores = $this->calculator->execute(
            province: $data['province'] ?? null,
            city: $data['city'] ?? null,
            district: $data['district'] ?? null,
            averageReportScore: $averageReport
        );

        // Generate unique registration number: PPDB2026-REGULER-0001
        $year = now()->format('Y');
        $trackCode = $track->code ?? 'REG';
        $countThisYear = PpdbApplicant::where('period_id', $period->id)->count() + 1;
        $regNumber = sprintf('PPDB%s-%s-%04d', $year, $trackCode, $countThisYear);

        // Ensure uniqueness
        while (PpdbApplicant::where('registration_number', $regNumber)->exists()) {
            $countThisYear++;
            $regNumber = sprintf('PPDB%s-%s-%04d', $year, $trackCode, $countThisYear);
        }

        $applicant = PpdbApplicant::create([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'department_id' => $data['department_id'] ?? null,
            'second_department_id' => $data['second_department_id'] ?? null,
            'registration_number' => $regNumber,
            'nisn' => $data['nisn'],
            'nik' => $data['nik'],
            'full_name' => $data['full_name'],
            'gender' => $data['gender'],
            'birth_place' => $data['birth_place'],
            'birth_date' => $data['birth_date'],
            'religion' => $data['religion'] ?? 'Islam',
            'address' => $data['address'],
            'province' => $data['province'],
            'city' => $data['city'],
            'district' => $data['district'],
            'village' => $data['village'] ?? null,
            'phone_number' => $data['phone_number'],
            'email' => $data['email'] ?? null,
            'distance_zone_score' => $scores['zone_score'],
            'average_report_score' => $averageReport,
            'final_score' => $scores['final_score'],
            'previous_school_name' => $data['previous_school_name'],
            'previous_school_address' => $data['previous_school_address'] ?? null,
            'graduation_year' => $data['graduation_year'] ?? (int) now()->format('Y'),
            'father_name' => $data['father_name'] ?? null,
            'father_occupation' => $data['father_occupation'] ?? null,
            'father_phone' => $data['father_phone'] ?? null,
            'mother_name' => $data['mother_name'] ?? null,
            'mother_occupation' => $data['mother_occupation'] ?? null,
            'mother_phone' => $data['mother_phone'] ?? null,
            'guardian_name' => $data['guardian_name'] ?? null,
            'guardian_occupation' => $data['guardian_occupation'] ?? null,
            'guardian_phone' => $data['guardian_phone'] ?? null,
            'parent_income' => $data['parent_income'] ?? null,
            'verification_status' => 'pending',
            'selection_status' => 'unprocessed',
            're_registration_status' => 'not_registered',
        ]);

        // Upload and create documents
        $docMap = [
            'photo_file' => 'photo',
            'family_card_file' => 'family_card',
            'birth_cert_file' => 'birth_certificate',
            'graduation_cert_file' => 'graduation_certificate',
            'achievement_cert_file' => 'achievement_certificate',
            'assistance_card_file' => 'assistance_card',
        ];

        foreach ($docMap as $fileKey => $docType) {
            if (isset($files[$fileKey]) && $files[$fileKey] instanceof UploadedFile) {
                $file = $files[$fileKey];
                $path = $file->store("ppdb/{$applicant->id}", 'public');

                PpdbDocument::create([
                    'applicant_id' => $applicant->id,
                    'document_type' => $docType,
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType() ?: 'application/octet-stream',
                    'status' => 'pending',
                ]);
            }
        }

        $this->auditLogger->execute(
            model: $applicant,
            event: 'created',
            oldValues: [],
            newValues: $applicant->toArray(),
            userId: null
        );

        return $applicant;
    }
}
