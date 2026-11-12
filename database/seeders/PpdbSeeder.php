<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\PpdbApplicant;
use App\Models\PpdbDocument;
use App\Models\PpdbPeriod;
use App\Models\PpdbTrack;
use Illuminate\Database\Seeder;

class PpdbSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicYear = AcademicYear::where('is_active', true)->first()
            ?? AcademicYear::first();

        if (! $academicYear) {
            return;
        }

        // 1. Create Active PPDB Period
        $period = PpdbPeriod::firstOrCreate(
            ['slug' => 'ppdb-gelombang-1-2026-2027'],
            [
                'academic_year_id' => $academicYear->id,
                'name' => 'PPDB Gelombang 1 TP 2026/2027',
                'start_date' => now()->subDays(5)->toDateString(),
                'end_date' => now()->addDays(25)->toDateString(),
                'announcement_date' => now()->addDays(30)->toDateString(),
                're_registration_start' => now()->addDays(31)->toDateString(),
                're_registration_end' => now()->addDays(37)->toDateString(),
                'is_active' => true,
                'description' => 'Penerimaan Peserta Didik Baru SMK Eduvia Nusantara Tahun Pelajaran 2026/2027 Gelombang 1 Jalur Reguler, Prestasi, Afirmasi, dan Mutasi.',
            ]
        );

        // 2. Create Tracks
        $tracksData = [
            [
                'name' => 'Jalur Reguler / Zonasi',
                'code' => 'REGULER',
                'quota' => 60,
                'description' => 'Seleksi umum berdasarkan jarak zonasi tempat tinggal dan rata-rata nilai rapor.',
            ],
            [
                'name' => 'Jalur Prestasi Akademik & Non-Akademik',
                'code' => 'PRESTASI',
                'quota' => 30,
                'description' => 'Khusus calon siswa berprestasi lomba kejuaraan sains, olahraga, seni, dan nilai rapor unggul.',
            ],
            [
                'name' => 'Jalur Afirmasi (KIP / PKH / Prasejahtera)',
                'code' => 'AFIRMASI',
                'quota' => 20,
                'description' => 'Khusus calon peserta didik dari keluarga pemegang kartu bantuan pemerintah (KIP, PKH, KKS).',
            ],
            [
                'name' => 'Jalur Perpindahan Tugas Orang Tua / Mutasi',
                'code' => 'MUTASI',
                'quota' => 10,
                'description' => 'Bagi calon siswa yang mengikuti perpindahan tugas kedinasan orang tua/wali.',
            ],
        ];

        $tracks = [];
        foreach ($tracksData as $item) {
            $tracks[$item['code']] = PpdbTrack::firstOrCreate(
                [
                    'period_id' => $period->id,
                    'code' => $item['code'],
                ],
                [
                    'name' => $item['name'],
                    'quota' => $item['quota'],
                    'description' => $item['description'],
                    'is_active' => true,
                ]
            );
        }

        // 3. Departments
        $rpl = Department::where('code', 'RPL')->first();
        $tkj = Department::where('code', 'TKJ')->first();

        // 4. Sample Applicants for testing elimination ranking
        $sampleApplicants = [
            [
                'full_name' => 'Muhammad Rizky Pratama',
                'nisn' => '0091234561',
                'nik' => '3171012345670011',
                'gender' => 'L',
                'birth_place' => 'Jakarta',
                'birth_date' => '2010-05-14',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru', // Satu kecamatan dengan sekolah -> Skor 3
                'village' => 'Senayan',
                'address' => 'Jl. Senayan Raya No. 15 RT 02/RW 04',
                'phone_number' => '081298765431',
                'previous_school_name' => 'SMP Negeri 1 Jakarta',
                'graduation_year' => 2026,
                'distance_zone_score' => 3,
                'average_report_score' => 88.50,
                'final_score' => 388.50, // (3 * 100) + 88.50
                'track' => 'AFIRMASI',
                'department_id' => $rpl?->id,
                'verification_status' => 'verified',
            ],
            [
                'full_name' => 'Aulia Siti Rahma',
                'nisn' => '0091234562',
                'nik' => '3171012345670012',
                'gender' => 'P',
                'birth_place' => 'Jakarta',
                'birth_date' => '2010-08-22',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru', // Satu kecamatan -> Skor 3
                'village' => 'Gunung',
                'address' => 'Jl. Bumi Asri Blok C No. 4',
                'phone_number' => '081298765432',
                'previous_school_name' => 'SMP Negeri 11 Jakarta',
                'graduation_year' => 2026,
                'distance_zone_score' => 3,
                'average_report_score' => 92.00,
                'final_score' => 392.00, // (3 * 100) + 92.00 -> Juara 1 di afirmasi!
                'track' => 'AFIRMASI',
                'department_id' => $rpl?->id,
                'verification_status' => 'verified',
            ],
            [
                'full_name' => 'Dimas Aditya Saputra',
                'nisn' => '0091234563',
                'nik' => '3171012345670013',
                'gender' => 'L',
                'birth_place' => 'Jakarta',
                'birth_date' => '2010-03-10',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Timur', // Satu kota/provinsi tapi beda kecamatan -> Skor 2 (atau 1 jika beda kota)
                'district' => 'Duren Sawit',
                'village' => 'Pondok Kelapa',
                'address' => 'Jl. Dermaga No. 22',
                'phone_number' => '081298765433',
                'previous_school_name' => 'SMP Negeri 255 Jakarta',
                'graduation_year' => 2026,
                'distance_zone_score' => 1,
                'average_report_score' => 95.00,
                'final_score' => 195.00, // Rapor sangat tinggi, tapi zonasi skor 1
                'track' => 'AFIRMASI',
                'department_id' => $rpl?->id,
                'verification_status' => 'verified',
            ],
            [
                'full_name' => 'Fathia Zahra Kirana',
                'nisn' => '0091234564',
                'nik' => '3171012345670014',
                'gender' => 'P',
                'birth_place' => 'Bandung',
                'birth_date' => '2010-11-05',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Cilandak', // Satu kota (Jaksel) beda kecamatan -> Skor 2
                'village' => 'Lebak Bulus',
                'address' => 'Jl. Lebak Bulus Raya No. 8',
                'phone_number' => '081298765434',
                'previous_school_name' => 'SMP Al-Azhar Jakarta',
                'graduation_year' => 2026,
                'distance_zone_score' => 2,
                'average_report_score' => 89.20,
                'final_score' => 289.20,
                'track' => 'REGULER',
                'department_id' => $tkj?->id,
                'verification_status' => 'pending', // Masih pending
            ],
        ];

        $counter = 1;
        foreach ($sampleApplicants as $item) {
            $regNumber = sprintf('PPDB2026-%s-%04d', $item['track'], $counter);
            $counter++;

            $applicant = PpdbApplicant::firstOrCreate(
                ['nisn' => $item['nisn']],
                [
                    'period_id' => $period->id,
                    'track_id' => $tracks[$item['track']]->id,
                    'department_id' => $item['department_id'],
                    'registration_number' => $regNumber,
                    'nik' => $item['nik'],
                    'full_name' => $item['full_name'],
                    'gender' => $item['gender'],
                    'birth_place' => $item['birth_place'],
                    'birth_date' => $item['birth_date'],
                    'religion' => 'Islam',
                    'address' => $item['address'],
                    'province' => $item['province'],
                    'city' => $item['city'],
                    'district' => $item['district'],
                    'village' => $item['village'],
                    'phone_number' => $item['phone_number'],
                    'distance_zone_score' => $item['distance_zone_score'],
                    'average_report_score' => $item['average_report_score'],
                    'final_score' => $item['final_score'],
                    'previous_school_name' => $item['previous_school_name'],
                    'graduation_year' => $item['graduation_year'],
                    'father_name' => 'Hendra Gunawan',
                    'father_occupation' => 'Karyawan Swasta',
                    'father_phone' => '081234567890',
                    'mother_name' => 'Siti Nurhaliza',
                    'mother_occupation' => 'Ibu Rumah Tangga',
                    'mother_phone' => '081234567891',
                    'verification_status' => $item['verification_status'],
                    'selection_status' => 'unprocessed',
                    're_registration_status' => 'not_registered',
                ]
            );

            // Add sample documents
            PpdbDocument::firstOrCreate(
                [
                    'applicant_id' => $applicant->id,
                    'document_type' => 'photo',
                ],
                [
                    'file_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    'original_name' => 'pas_foto_3x4.jpg',
                    'file_size' => 1024 * 350,
                    'mime_type' => 'image/jpeg',
                    'status' => 'valid',
                ]
            );

            PpdbDocument::firstOrCreate(
                [
                    'applicant_id' => $applicant->id,
                    'document_type' => 'family_card',
                ],
                [
                    'file_path' => 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
                    'original_name' => 'kartu_keluarga_scan.jpg',
                    'file_size' => 1024 * 720,
                    'mime_type' => 'image/jpeg',
                    'status' => 'valid',
                ]
            );
        }
    }
}
