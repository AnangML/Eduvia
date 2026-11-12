<?php

namespace App\Http\Controllers\Ppdb;

use App\Actions\Ppdb\ConvertApplicantToStudent;
use App\Actions\Ppdb\RunEliminationSelection;
use App\Actions\Ppdb\VerifyApplicant;
use App\Exports\PpdbApplicantsExport;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\PpdbApplicant;
use App\Models\PpdbPeriod;
use App\Models\PpdbTrack;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PpdbAdminController extends Controller
{
    public function dashboard(): Response
    {
        $activePeriod = PpdbPeriod::where('is_active', true)->with('tracks')->first()
            ?? PpdbPeriod::latest()->with('tracks')->first();

        $stats = [
            'total_applicants' => PpdbApplicant::count(),
            'verified_applicants' => PpdbApplicant::where('verification_status', 'verified')->count(),
            'pending_verification' => PpdbApplicant::where('verification_status', 'pending')->count(),
            'needs_revision' => PpdbApplicant::where('verification_status', 'needs_revision')->count(),
            'accepted_applicants' => PpdbApplicant::where('selection_status', 'accepted')->count(),
            'waiting_list_applicants' => PpdbApplicant::where('selection_status', 'waiting_list')->count(),
            're_registered_applicants' => PpdbApplicant::where('re_registration_status', 're_registered')->count(),
            'converted_students' => PpdbApplicant::whereNotNull('converted_to_student_id')->count(),
        ];

        $tracksStats = PpdbTrack::where('period_id', $activePeriod?->id)
            ->withCount([
                'applicants as total_count',
                'applicants as verified_count' => fn ($q) => $q->where('verification_status', 'verified'),
                'applicants as accepted_count' => fn ($q) => $q->where('selection_status', 'accepted'),
            ])
            ->get();

        $departmentsStats = Department::withCount([
            'ppdbFirstChoiceApplicants as first_choice_count',
        ])->get();

        $recentApplicants = PpdbApplicant::with(['track', 'department'])
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Ppdb/Dashboard', [
            'period' => $activePeriod,
            'stats' => $stats,
            'tracksStats' => $tracksStats,
            'departmentsStats' => $departmentsStats,
            'recentApplicants' => $recentApplicants,
        ]);
    }

    public function periods(): Response
    {
        $periods = PpdbPeriod::with(['academicYear', 'tracks'])
            ->withCount('applicants')
            ->latest('start_date')
            ->paginate(10);

        $academicYears = AcademicYear::orderByDesc('start_date')->get();

        return Inertia::render('Ppdb/Periods/Index', [
            'periods' => $periods,
            'academicYears' => $academicYears,
        ]);
    }

    public function storePeriod(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'announcement_date' => ['nullable', 'date'],
            're_registration_start' => ['nullable', 'date'],
            're_registration_end' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'tracks' => ['nullable', 'array'],
            'tracks.*.name' => ['required', 'string'],
            'tracks.*.code' => ['required', 'string'],
            'tracks.*.quota' => ['required', 'integer', 'min:0'],
        ]);

        $period = PpdbPeriod::create([
            'academic_year_id' => $data['academic_year_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['name']).'-'.time(),
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'announcement_date' => $data['announcement_date'] ?? null,
            're_registration_start' => $data['re_registration_start'] ?? null,
            're_registration_end' => $data['re_registration_end'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'description' => $data['description'] ?? null,
        ]);

        if (! empty($data['tracks'])) {
            foreach ($data['tracks'] as $t) {
                PpdbTrack::create([
                    'period_id' => $period->id,
                    'name' => $t['name'],
                    'code' => strtoupper($t['code']),
                    'quota' => $t['quota'],
                    'is_active' => true,
                ]);
            }
        }

        return back()->with('success', "Gelombang PPDB '{$period->name}' berhasil dibuat.");
    }

    public function updatePeriod(Request $request, PpdbPeriod $period): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'announcement_date' => ['nullable', 'date'],
            're_registration_start' => ['nullable', 'date'],
            're_registration_end' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
        ]);

        $period->update($data);

        return back()->with('success', "Gelombang PPDB '{$period->name}' berhasil diperbarui.");
    }

    public function togglePeriodActive(PpdbPeriod $period): RedirectResponse
    {
        $period->update(['is_active' => ! $period->is_active]);

        return back()->with('success', 'Status gelombang PPDB berhasil diubah.');
    }

    public function applicants(Request $request): Response
    {
        $search = $request->input('search');
        $periodId = $request->input('period_id');
        $trackId = $request->input('track_id');
        $departmentId = $request->input('department_id');
        $verificationStatus = $request->input('verification_status');
        $selectionStatus = $request->input('selection_status');

        $applicants = PpdbApplicant::with(['period', 'track', 'department'])
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('full_name', 'ilike', "%{$search}%")
                        ->orWhere('registration_number', 'ilike', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%");
                });
            })
            ->when($periodId, fn ($q) => $q->where('period_id', $periodId))
            ->when($trackId, fn ($q) => $q->where('track_id', $trackId))
            ->when($departmentId, fn ($q) => $q->where('department_id', $departmentId))
            ->when($verificationStatus, fn ($q) => $q->where('verification_status', $verificationStatus))
            ->when($selectionStatus, fn ($q) => $q->where('selection_status', $selectionStatus))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $periods = PpdbPeriod::orderByDesc('start_date')->get();
        $tracks = PpdbTrack::where('is_active', true)->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Ppdb/Applicants/Index', [
            'applicants' => $applicants,
            'periods' => $periods,
            'tracks' => $tracks,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
                'track_id' => $trackId,
                'department_id' => $departmentId,
                'verification_status' => $verificationStatus,
                'selection_status' => $selectionStatus,
            ],
        ]);
    }

    public function showApplicant(PpdbApplicant $applicant): Response
    {
        $applicant->load(['period', 'track', 'department', 'secondDepartment', 'documents', 'verifiedBy', 'convertedToStudent']);

        return Inertia::render('Ppdb/Applicants/Show', [
            'applicant' => $applicant,
        ]);
    }

    public function verifyApplicant(Request $request, PpdbApplicant $applicant, VerifyApplicant $action): RedirectResponse
    {
        $data = $request->validate([
            'verification_status' => ['required', 'in:verified,needs_revision,rejected'],
            'verification_notes' => ['nullable', 'string'],
            'average_report_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'distance_zone_score' => ['nullable', 'integer', 'in:0,1,2,3'],
        ]);

        $action->execute($applicant, $data, $request->user());

        return back()->with('success', "Status verifikasi untuk {$applicant->full_name} berhasil diperbarui.");
    }

    public function selection(Request $request): Response
    {
        $periods = PpdbPeriod::orderByDesc('start_date')->get();
        $activePeriod = PpdbPeriod::where('is_active', true)->first() ?? $periods->first();

        $periodId = $request->input('period_id', $activePeriod?->id);
        $trackId = $request->input('track_id');
        $departmentId = $request->input('department_id');

        $tracks = PpdbTrack::when($periodId, fn ($q) => $q->where('period_id', $periodId))->get();
        $departments = Department::orderBy('name')->get();

        $selectedTrack = $trackId ? PpdbTrack::find($trackId) : $tracks->first();

        // Applicants evaluated / sorted for live simulation
        $applicants = PpdbApplicant::with(['track', 'department'])
            ->where('period_id', $periodId)
            ->where('verification_status', 'verified')
            ->when($selectedTrack, fn ($q) => $q->where('track_id', $selectedTrack->id))
            ->when($departmentId, fn ($q) => $q->where('department_id', $departmentId))
            ->orderByDesc('final_score')
            ->orderByDesc('distance_zone_score')
            ->orderByDesc('average_report_score')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Ppdb/Selection/Index', [
            'periods' => $periods,
            'tracks' => $tracks,
            'departments' => $departments,
            'selectedPeriodId' => $periodId,
            'selectedTrack' => $selectedTrack,
            'selectedDepartmentId' => $departmentId,
            'applicants' => $applicants,
        ]);
    }

    public function runSelection(Request $request, RunEliminationSelection $action): RedirectResponse
    {
        $request->validate([
            'period_id' => ['required', 'exists:ppdb_periods,id'],
            'track_id' => ['nullable', 'exists:ppdb_tracks,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ]);

        $period = PpdbPeriod::findOrFail($request->input('period_id'));
        $track = $request->input('track_id') ? PpdbTrack::find($request->input('track_id')) : null;
        $departmentId = $request->input('department_id');

        $result = $action->execute(
            period: $period,
            track: $track,
            departmentId: $departmentId ? (int) $departmentId : null,
            actor: $request->user()
        );

        return back()->with('success', sprintf(
            'Seleksi eliminasi berhasil dijalankan! %d calon siswa diproses (%d Diterima, %d Cadangan, %d Tereliminasi).',
            $result['total_processed'],
            $result['accepted_count'],
            $result['waiting_list_count'],
            $result['rejected_count']
        ));
    }

    public function reRegistration(Request $request): Response
    {
        $periodId = $request->input('period_id');
        $periods = PpdbPeriod::orderByDesc('start_date')->get();

        $applicants = PpdbApplicant::with(['track', 'department', 'convertedToStudent'])
            ->where('selection_status', 'accepted')
            ->when($periodId, fn ($q) => $q->where('period_id', $periodId))
            ->orderBy('full_name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Ppdb/ReRegistration/Index', [
            'applicants' => $applicants,
            'periods' => $periods,
            'selectedPeriodId' => $periodId,
        ]);
    }

    public function toggleReRegistration(PpdbApplicant $applicant): RedirectResponse
    {
        $newStatus = $applicant->re_registration_status === 're_registered' ? 'not_registered' : 're_registered';
        $applicant->update(['re_registration_status' => $newStatus]);

        return back()->with('success', "Status daftar ulang untuk {$applicant->full_name} berhasil diperbarui.");
    }

    public function convertApplicant(PpdbApplicant $applicant, ConvertApplicantToStudent $action, Request $request): RedirectResponse
    {
        $student = $action->execute($applicant, $request->user());

        return back()->with('success', "Calon siswa {$applicant->full_name} berhasil dikonversi menjadi Siswa Aktif (NIS: {$student->nis}) lengkap dengan akun login.");
    }

    public function export(Request $request): BinaryFileResponse
    {
        $periodId = $request->input('period_id') ? (int) $request->input('period_id') : null;
        $trackId = $request->input('track_id') ? (int) $request->input('track_id') : null;
        $verificationStatus = $request->input('verification_status');
        $selectionStatus = $request->input('selection_status');

        $filename = 'ppdb_pendaftar_'.date('Ymd_His').'.xlsx';

        return Excel::download(
            new PpdbApplicantsExport($periodId, $trackId, $verificationStatus, $selectionStatus),
            $filename
        );
    }
}
