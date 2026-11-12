<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\PpdbApplicant;
use App\Models\PpdbPeriod;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicPpdbTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Storage::fake('public');
    }

    public function test_public_ppdb_index_page_is_accessible(): void
    {
        $response = $this->get(route('public.ppdb.index'));
        $response->assertOk();
    }

    public function test_public_ppdb_register_page_is_accessible_when_period_is_open(): void
    {
        $response = $this->get(route('public.ppdb.register'));
        $response->assertOk();
    }

    public function test_public_ppdb_register_submission_validates_and_redirects_to_success(): void
    {
        $period = PpdbPeriod::where('is_active', true)->first();
        $track = $period->tracks()->first();
        $dept = Department::first();

        $photo = UploadedFile::fake()->image('foto_3x4.jpg', 300, 400);
        $kk = UploadedFile::fake()->create('kartu_keluarga.pdf', 500, 'application/pdf');
        $akta = UploadedFile::fake()->create('akta_kelahiran.pdf', 500, 'application/pdf');
        $skl = UploadedFile::fake()->create('ijazah_skl.pdf', 500, 'application/pdf');

        $payload = [
            'period_id' => $period->id,
            'track_id' => $track->id,
            'department_id' => $dept->id,
            'nisn' => '0098765432',
            'nik' => '3171012345679999',
            'full_name' => 'Aditya Putra Pratama',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-07-20',
            'religion' => 'Islam',
            'address' => 'Jl. Tebet Barat Raya No. 40',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'phone_number' => '081299998888',
            'email' => 'aditya@example.com',
            'previous_school_name' => 'SMP Negeri 1 Jakarta',
            'graduation_year' => 2026,
            'average_report_score' => '89.50',
            'photo_file' => $photo,
            'family_card_file' => $kk,
            'birth_cert_file' => $akta,
            'graduation_cert_file' => $skl,
        ];

        $response = $this->post(route('public.ppdb.store'), $payload);

        $applicant = PpdbApplicant::where('nisn', '0098765432')->first();
        $this->assertNotNull($applicant);
        $this->assertEquals(3, $applicant->distance_zone_score);
        $this->assertEquals(389.50, $applicant->final_score);
        $this->assertEquals(4, $applicant->documents()->count());

        $response->assertRedirect(route('public.ppdb.success', $applicant->registration_number));
    }

    public function test_public_ppdb_check_status_finds_applicant(): void
    {
        $applicant = PpdbApplicant::first();
        $this->assertNotNull($applicant);

        $response = $this->get(route('public.ppdb.check-status', [
            'identifier' => $applicant->registration_number,
            'birth_date' => $applicant->birth_date->format('Y-m-d'),
        ]));

        $response->assertOk();
    }

    public function test_reupload_document_when_status_is_needs_revision(): void
    {
        $applicant = PpdbApplicant::first();
        $applicant->update([
            'verification_status' => 'needs_revision',
            'verification_notes' => 'Scan kartu keluarga buram, silakan upload ulang.',
        ]);

        $newKk = UploadedFile::fake()->create('kk_perbaikan.pdf', 600, 'application/pdf');

        $response = $this->post(route('public.ppdb.reupload', $applicant->registration_number), [
            'document_type' => 'family_card',
            'file' => $newKk,
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('pending', $applicant->fresh()->verification_status);
    }
}
