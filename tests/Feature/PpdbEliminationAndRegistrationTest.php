<?php

namespace Tests\Feature;

use App\Actions\Ppdb\CalculateZoneScore;
use App\Actions\Ppdb\ConvertApplicantToStudent;
use App\Actions\Ppdb\RegisterApplicant;
use App\Actions\Ppdb\RunEliminationSelection;
use App\Models\Department;
use App\Models\PpdbApplicant;
use App\Models\PpdbPeriod;
use App\Models\Setting;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PpdbEliminationAndRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_zone_score_and_final_score_calculation(): void
    {
        Setting::updateOrCreate(['key' => 'school_province'], ['value' => 'DKI Jakarta']);
        Setting::updateOrCreate(['key' => 'school_city'], ['value' => 'Jakarta Selatan']);
        Setting::updateOrCreate(['key' => 'school_district'], ['value' => 'Kebayoran Baru']);

        $calculator = app(CalculateZoneScore::class);

        // Same district
        $score3 = $calculator->execute('DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 85.50);
        $this->assertEquals(3, $score3['zone_score']);
        $this->assertEquals(385.50, $score3['final_score']);

        // Same city, different district
        $score2 = $calculator->execute('DKI Jakarta', 'Jakarta Selatan', 'Tebet', 90.00);
        $this->assertEquals(2, $score2['zone_score']);
        $this->assertEquals(290.00, $score2['final_score']);

        // Same province, different city
        $score1 = $calculator->execute('DKI Jakarta', 'Jakarta Timur', 'Duren Sawit', 95.00);
        $this->assertEquals(1, $score1['zone_score']);
        $this->assertEquals(195.00, $score1['final_score']);

        // Outside province
        $score0 = $calculator->execute('Jawa Barat', 'Bandung', 'Coblong', 88.00);
        $this->assertEquals(0, $score0['zone_score']);
        $this->assertEquals(88.00, $score0['final_score']);
    }

    public function test_applicant_registration_generates_unique_number_and_calculates_scores(): void
    {
        $period = PpdbPeriod::where('is_active', true)->first();
        $track = $period->tracks()->first();
        $department = Department::first();

        $action = app(RegisterApplicant::class);

        $applicant = $action->execute([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'department_id' => $department->id,
            'nisn' => '0099887766',
            'nik' => '3171012345678901',
            'full_name' => 'Bintang Pratama',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-04-12',
            'address' => 'Jl. Radio Dalam No. 10',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'phone_number' => '081234567899',
            'previous_school_name' => 'SMPN 11 Jakarta',
            'graduation_year' => 2026,
            'average_report_score' => 87.50,
        ]);

        $this->assertNotNull($applicant->id);
        $this->assertStringStartsWith('PPDB', $applicant->registration_number);
        $this->assertEquals(3, $applicant->distance_zone_score);
        $this->assertEquals(387.50, $applicant->final_score);
        $this->assertEquals('pending', $applicant->verification_status);
        $this->assertEquals('unprocessed', $applicant->selection_status);
    }

    public function test_elimination_selection_ranks_and_accepts_applicants_based_on_quota(): void
    {
        $period = PpdbPeriod::where('is_active', true)->first();
        $track = $period->tracks()->first();
        $track->update(['quota' => 2]); // Kuota hanya 2 siswa

        // Hapus applicants lama di track ini agar bersih untuk test
        PpdbApplicant::where('track_id', $track->id)->forceDelete();

        // Buat 3 applicant terverifikasi dengan skor berbeda
        // Applicant 1: Zone 3, Report 80.00 -> final 380.00
        $app1 = PpdbApplicant::create([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'registration_number' => 'TEST-001',
            'nisn' => '1111111111',
            'nik' => '1111111111111111',
            'full_name' => 'Siswa Ranking 2',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-01-01',
            'address' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'phone_number' => '081111111111',
            'previous_school_name' => 'SMP 1',
            'graduation_year' => 2026,
            'distance_zone_score' => 3,
            'average_report_score' => 80.00,
            'final_score' => 380.00,
            'verification_status' => 'verified',
        ]);

        // Applicant 2: Zone 3, Report 90.00 -> final 390.00 (Juara 1)
        $app2 = PpdbApplicant::create([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'registration_number' => 'TEST-002',
            'nisn' => '2222222222',
            'nik' => '2222222222222222',
            'full_name' => 'Siswa Ranking 1',
            'gender' => 'P',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-02-02',
            'address' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'phone_number' => '082222222222',
            'previous_school_name' => 'SMP 2',
            'graduation_year' => 2026,
            'distance_zone_score' => 3,
            'average_report_score' => 90.00,
            'final_score' => 390.00,
            'verification_status' => 'verified',
        ]);

        // Applicant 3: Zone 2, Report 95.00 -> final 295.00 (Peringkat 3 -> Cadangan / Waiting List karena kuota 2)
        $app3 = PpdbApplicant::create([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'registration_number' => 'TEST-003',
            'nisn' => '3333333333',
            'nik' => '3333333333333333',
            'full_name' => 'Siswa Ranking 3',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-03-03',
            'address' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Timur',
            'district' => 'Cakung',
            'phone_number' => '083333333333',
            'previous_school_name' => 'SMP 3',
            'graduation_year' => 2026,
            'distance_zone_score' => 1,
            'average_report_score' => 95.00,
            'final_score' => 195.00,
            'verification_status' => 'verified',
        ]);

        $admin = User::first();
        $elimination = app(RunEliminationSelection::class);
        $result = $elimination->execute(period: $period, track: $track, actor: $admin);

        $this->assertEquals(3, $result['total_processed']);
        $this->assertEquals(2, $result['accepted_count']);
        $this->assertEquals(1, $result['waiting_list_count']);

        $this->assertEquals(1, $app2->fresh()->ranking);
        $this->assertEquals('accepted', $app2->fresh()->selection_status);

        $this->assertEquals(2, $app1->fresh()->ranking);
        $this->assertEquals('accepted', $app1->fresh()->selection_status);

        $this->assertEquals(3, $app3->fresh()->ranking);
        $this->assertEquals('waiting_list', $app3->fresh()->selection_status);
    }

    public function test_accepted_applicant_converts_to_active_student_with_user_account(): void
    {
        $period = PpdbPeriod::where('is_active', true)->first();
        $track = $period->tracks()->first();

        $applicant = PpdbApplicant::create([
            'period_id' => $period->id,
            'track_id' => $track->id,
            'registration_number' => 'TEST-CONVERT-01',
            'nisn' => '9988776655',
            'nik' => '3171012345678888',
            'full_name' => 'Calon Siswa Berprestasi',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-06-15',
            'address' => 'Jl. Sudirman No. 12',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'phone_number' => '081234567888',
            'previous_school_name' => 'SMP 10 Jakarta',
            'graduation_year' => 2026,
            'average_report_score' => 92.50,
            'final_score' => 392.50,
            'verification_status' => 'verified',
            'selection_status' => 'accepted',
            'father_name' => 'Bambang Sudirman',
            'father_phone' => '081234567000',
        ]);

        $admin = User::first();
        $action = app(ConvertApplicantToStudent::class);
        $student = $action->execute($applicant, $admin);

        $this->assertInstanceOf(Student::class, $student);
        $this->assertEquals('9988776655', $student->nisn);
        $this->assertEquals('active', $student->status);
        $this->assertNotNull($student->user);
        $this->assertEquals('9988776655', $student->user->username);
        $this->assertTrue($student->user->hasRole('student'));

        // Check applicant updated
        $this->assertEquals($student->id, $applicant->fresh()->converted_to_student_id);
        $this->assertEquals('re_registered', $applicant->fresh()->re_registration_status);
        $this->assertNotNull($applicant->fresh()->converted_at);

        // Check guardian created
        $this->assertEquals(1, $student->guardians()->count());
        $this->assertEquals('Bambang Sudirman', $student->guardians()->first()->name);
    }
}
