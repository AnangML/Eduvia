<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\PpdbApplicant;
use App\Models\PpdbPeriod;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPpdbTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->admin = User::where('email', 'admin@eduvia.test')->first()
            ?? User::factory()->create();

        if (! $this->admin->hasRole('super_admin')) {
            $this->admin->assignRole('super_admin');
        }
    }

    public function test_admin_can_access_ppdb_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get(route('ppdb.dashboard'));
        $response->assertOk();
    }

    public function test_admin_can_view_and_create_ppdb_period(): void
    {
        $response = $this->actingAs($this->admin)->get(route('ppdb.periods.index'));
        $response->assertOk();

        $academicYear = AcademicYear::first();

        $payload = [
            'academic_year_id' => $academicYear->id,
            'name' => 'PPDB Gelombang 2 TP 2026/2027',
            'start_date' => now()->addDays(40)->toDateString(),
            'end_date' => now()->addDays(70)->toDateString(),
            'is_active' => true,
            'tracks' => [
                ['name' => 'Jalur Reguler', 'code' => 'REG2', 'quota' => 50],
            ],
        ];

        $postResponse = $this->actingAs($this->admin)->post(route('ppdb.periods.store'), $payload);
        $postResponse->assertSessionHas('success');

        $this->assertDatabaseHas('ppdb_periods', ['name' => 'PPDB Gelombang 2 TP 2026/2027']);
        $this->assertDatabaseHas('ppdb_tracks', ['code' => 'REG2', 'quota' => 50]);
    }

    public function test_admin_can_view_applicants_list_and_detail(): void
    {
        $applicant = PpdbApplicant::first();
        $this->assertNotNull($applicant);

        $listResponse = $this->actingAs($this->admin)->get(route('ppdb.applicants.index'));
        $listResponse->assertOk();

        $showResponse = $this->actingAs($this->admin)->get(route('ppdb.applicants.show', $applicant->id));
        $showResponse->assertOk();
    }

    public function test_admin_can_verify_applicant_with_notes(): void
    {
        $applicant = PpdbApplicant::first();

        $response = $this->actingAs($this->admin)->post(route('ppdb.applicants.verify', $applicant->id), [
            'verification_status' => 'needs_revision',
            'verification_notes' => 'Scan kartu keluarga bagian NIK buram, tolong perbaiki.',
            'average_report_score' => '90.50',
            'distance_zone_score' => 3,
        ]);

        $response->assertSessionHas('success');

        $applicant->refresh();
        $this->assertEquals('needs_revision', $applicant->verification_status);
        $this->assertEquals('Scan kartu keluarga bagian NIK buram, tolong perbaiki.', $applicant->verification_notes);
        $this->assertEquals('90.50', $applicant->average_report_score);
        $this->assertEquals(3, $applicant->distance_zone_score);
        $this->assertEquals('390.50', $applicant->final_score);
    }

    public function test_admin_can_view_selection_simulation_and_run_elimination(): void
    {
        $period = PpdbPeriod::where('is_active', true)->first();
        $track = $period->tracks()->first();

        $viewResponse = $this->actingAs($this->admin)->get(route('ppdb.selection.index', [
            'period_id' => $period->id,
            'track_id' => $track->id,
        ]));
        $viewResponse->assertOk();

        $runResponse = $this->actingAs($this->admin)->post(route('ppdb.selection.run'), [
            'period_id' => $period->id,
            'track_id' => $track->id,
        ]);

        $runResponse->assertSessionHas('success');
    }

    public function test_admin_can_view_re_registration_and_convert_applicant(): void
    {
        $viewResponse = $this->actingAs($this->admin)->get(route('ppdb.re-registration.index'));
        $viewResponse->assertOk();

        $applicant = PpdbApplicant::first();
        $applicant->update([
            'verification_status' => 'verified',
            'selection_status' => 'accepted',
            're_registration_status' => 're_registered',
        ]);

        $convertResponse = $this->actingAs($this->admin)->post(route('ppdb.applicants.convert', $applicant->id));
        $convertResponse->assertSessionHas('success');

        $applicant->refresh();
        $this->assertNotNull($applicant->converted_to_student_id);

        $student = Student::find($applicant->converted_to_student_id);
        $this->assertNotNull($student);
        $this->assertEquals($applicant->nisn, $student->nisn);
    }

    public function test_admin_can_export_applicants_to_excel(): void
    {
        $response = $this->actingAs($this->admin)->get(route('ppdb.export'));
        $response->assertOk();
        $this->assertTrue(str_contains($response->headers->get('content-disposition') ?? '', '.xlsx'));
    }
}
