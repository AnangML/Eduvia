<?php

namespace App\Http\Controllers\Cms;

use App\Actions\Cms\SaveSchoolProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\SchoolProfileRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SchoolProfileController extends Controller
{
    public function index(): Response
    {
        $profile = [
            'school_name' => Setting::get('school_name', 'SMK Eduvia'),
            'school_tagline' => Setting::get('school_tagline', 'Membentuk Generasi Cerdas, Unggul, dan Berakhlak Mulia'),
            'school_logo' => Setting::get('school_logo', ''),
            'school_description' => Setting::get('school_description', 'Lembaga pendidikan unggulan berbasis teknologi dan karakter masa depan.'),
            'school_vision' => Setting::get('school_vision', 'Menjadi institusi pendidikan pelopor keunggulan akademik dan vokasi berbasis nilai luhur.'),
            'school_mission' => Setting::get('school_mission', "1. Mengembangkan kurikulum relevan industri.\n2. Menumbuhkan integritas dan karakter akhlak mulia.\n3. Menguasai sains dan teknologi mutakhir."),
            'school_history' => Setting::get('school_history', 'Didirikan dengan dedikasi mencerdaskan kehidupan bangsa melalui ekosistem pembelajaran modern.'),
            'school_address' => Setting::get('school_address', 'Jl. Pendidikan Mandiri No. 102, Jakarta'),
            'school_phone' => Setting::get('school_phone', '(021) 555-0192'),
            'school_email' => Setting::get('school_email', 'info@eduvia.sch.id'),
            'school_map_embed' => Setting::get('school_map_embed', ''),
            'social_instagram' => Setting::get('social_instagram', 'https://instagram.com/eduviaschool'),
            'social_facebook' => Setting::get('social_facebook', 'https://facebook.com/eduviaschool'),
            'social_youtube' => Setting::get('social_youtube', 'https://youtube.com/@eduviaschool'),
            'principal_name' => Setting::get('principal_name', 'Drs. H. Hendra Setiawan, M.Pd.'),
            'principal_title' => Setting::get('principal_title', 'Kepala Sekolah SMK Eduvia Nusantara'),
            'principal_photo' => Setting::get('principal_photo', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'),
            'principal_welcome' => Setting::get('principal_welcome', "Assalamu’alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di gerbang digital resmi SMK Eduvia Nusantara. Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual dan keahlian vokasional, melainkan juga menanamkan ketangguhan karakter, kejujuran budi pekerti, serta kesiapan menyongsong disrupsi peradaban global.\n\nDidukung tenaga pendidik berpengalaman, sarana laboratorium modern berbasis standar industri, serta kurikulum yang adaptif, kami berkomitmen mendampingi setiap peserta didik bertumbuh menjadi insan mandiri, berdaya saing internasional, dan berakhlak mulia. Mari melangkah bersama menuju masa depan gemilang."),
        ];

        return Inertia::render('Cms/SchoolProfile/Index', [
            'profile' => $profile,
        ]);
    }

    public function update(SchoolProfileRequest $request, SaveSchoolProfile $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        return back()->with('success', 'Profil dan identitas sekolah berhasil diperbarui.');
    }
}
