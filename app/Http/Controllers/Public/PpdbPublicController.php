<?php

namespace App\Http\Controllers\Public;

use App\Actions\Ppdb\RegisterApplicant;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\PpdbRegistrationRequest;
use App\Models\Department;
use App\Models\PpdbApplicant;
use App\Models\PpdbDocument;
use App\Models\PpdbPeriod;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PpdbPublicController extends Controller
{
    public function index(): Response
    {
        $activePeriod = PpdbPeriod::where('is_active', true)
            ->with(['tracks' => fn ($q) => $q->where('is_active', true)])
            ->first();

        $departments = Department::orderBy('name')->get();

        $schoolSettings = Setting::whereIn('key', [
            'school_name',
            'school_tagline',
            'school_address',
            'school_province',
            'school_city',
            'school_district',
            'school_phone',
            'school_email',
        ])->pluck('value', 'key');

        return Inertia::render('Public/Ppdb/Index', [
            'period' => $activePeriod,
            'departments' => $departments,
            'schoolSettings' => $schoolSettings,
        ]);
    }

    public function register(): Response|RedirectResponse
    {
        $activePeriod = PpdbPeriod::where('is_active', true)
            ->with(['tracks' => fn ($q) => $q->where('is_active', true)])
            ->first();

        if (! $activePeriod || ! $activePeriod->isOpen()) {
            return redirect()->route('public.ppdb.index')
                ->with('error', 'Pendaftaran PPDB saat ini sedang tidak dibuka.');
        }

        $departments = Department::orderBy('name')->get();

        $schoolSettings = Setting::whereIn('key', [
            'school_name',
            'school_province',
            'school_city',
            'school_district',
        ])->pluck('value', 'key');

        return Inertia::render('Public/Ppdb/Register', [
            'period' => $activePeriod,
            'tracks' => $activePeriod->tracks,
            'departments' => $departments,
            'schoolSettings' => $schoolSettings,
        ]);
    }

    public function store(PpdbRegistrationRequest $request, RegisterApplicant $action): RedirectResponse
    {
        $files = [
            'photo_file' => $request->file('photo_file'),
            'family_card_file' => $request->file('family_card_file'),
            'birth_cert_file' => $request->file('birth_cert_file'),
            'graduation_cert_file' => $request->file('graduation_cert_file'),
            'achievement_cert_file' => $request->file('achievement_cert_file'),
            'assistance_card_file' => $request->file('assistance_card_file'),
        ];

        $applicant = $action->execute(
            data: $request->validated(),
            files: $files
        );

        return redirect()->route('public.ppdb.success', $applicant->registration_number)
            ->with('success', 'Pendaftaran PPDB berhasil dikirim! Silakan simpan nomor registrasi Anda.');
    }

    public function success(string $registration_number): Response
    {
        $applicant = PpdbApplicant::where('registration_number', $registration_number)
            ->with(['period', 'track', 'department', 'secondDepartment', 'documents'])
            ->firstOrFail();

        $schoolSettings = Setting::whereIn('key', [
            'school_name',
            'school_tagline',
            'school_address',
            'school_phone',
            'school_email',
        ])->pluck('value', 'key');

        return Inertia::render('Public/Ppdb/Success', [
            'applicant' => $applicant,
            'schoolSettings' => $schoolSettings,
        ]);
    }

    public function checkStatus(Request $request): Response
    {
        $applicant = null;
        $searched = false;

        $identifier = trim((string) $request->input('identifier', ''));
        $birthDate = $request->input('birth_date');

        if ($identifier && $birthDate) {
            $searched = true;
            $applicant = PpdbApplicant::where(function ($q) use ($identifier) {
                $q->where('registration_number', $identifier)
                    ->orWhere('nisn', $identifier);
            })
                ->whereDate('birth_date', $birthDate)
                ->with(['period', 'track', 'department', 'secondDepartment', 'documents'])
                ->first();
        }

        $activePeriod = PpdbPeriod::where('is_active', true)->first();

        return Inertia::render('Public/Ppdb/CheckStatus', [
            'applicant' => $applicant,
            'searched' => $searched,
            'filters' => [
                'identifier' => $identifier,
                'birth_date' => $birthDate,
            ],
            'period' => $activePeriod,
        ]);
    }

    public function reuploadDocument(Request $request, string $registration_number): RedirectResponse
    {
        $applicant = PpdbApplicant::where('registration_number', $registration_number)->firstOrFail();

        if ($applicant->verification_status !== 'needs_revision') {
            return back()->with('error', 'Dokumen hanya dapat diunggah ulang bila berstatus "Perlu Perbaikan".');
        }

        $request->validate([
            'document_type' => ['required', 'string', 'in:photo,family_card,birth_certificate,graduation_certificate,achievement_certificate,assistance_card'],
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:4096'],
        ]);

        $file = $request->file('file');
        $docType = $request->input('document_type');
        $path = $file->store("ppdb/{$applicant->id}", 'public');

        PpdbDocument::updateOrCreate(
            [
                'applicant_id' => $applicant->id,
                'document_type' => $docType,
            ],
            [
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType() ?: 'application/octet-stream',
                'status' => 'pending',
                'notes' => 'Diunggah ulang oleh pendaftar',
            ]
        );

        // Reset applicant verification status back to pending for panitia review
        $applicant->update([
            'verification_status' => 'pending',
            'verification_notes' => 'Berkas telah diperbaiki oleh calon siswa dan menunggu verifikasi ulang panitia.',
        ]);

        return back()->with('success', 'Berkas berhasil diunggah ulang! Panitia akan memverifikasi kembali berkas Anda.');
    }
}
