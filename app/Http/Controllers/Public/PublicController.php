<?php

namespace App\Http\Controllers\Public;

use App\Actions\Cms\SubmitContactMessage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ContactMessageRequest;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\Facility;
use App\Models\GalleryAlbum;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Get common school profile settings.
     *
     * @return array<string, mixed>
     */
    protected function getSchoolProfile(): array
    {
        return [
            'school_name' => Setting::get('school_name', 'SMK Eduvia'),
            'school_tagline' => Setting::get('school_tagline', 'Membentuk Generasi Cerdas, Unggul, dan Berakhlak Mulia'),
            'school_logo' => Setting::get('school_logo'),
            'school_description' => Setting::get('school_description', 'Lembaga pendidikan unggulan berbasis teknologi dan karakter masa depan.'),
            'school_vision' => Setting::get('school_vision', 'Menjadi institusi pendidikan pelopor keunggulan akademik dan vokasi berbasis nilai luhur.'),
            'school_mission' => Setting::get('school_mission', "1. Mengembangkan kurikulum relevan industri.\n2. Menumbuhkan integritas dan karakter akhlak mulia.\n3. Menguasai sains dan teknologi mutakhir."),
            'school_history' => Setting::get('school_history', 'Didirikan dengan dedikasi mencerdaskan kehidupan bangsa melalui ekosistem pembelajaran modern.'),
            'school_address' => Setting::get('school_address', 'Jl. Pendidikan Mandiri No. 102, Jakarta'),
            'school_phone' => Setting::get('school_phone', '(021) 555-0192'),
            'school_email' => Setting::get('school_email', 'info@eduvia.sch.id'),
            'school_map_embed' => Setting::get('school_map_embed'),
            'social_instagram' => Setting::get('social_instagram', 'https://instagram.com/eduviaschool'),
            'social_facebook' => Setting::get('social_facebook', 'https://facebook.com/eduviaschool'),
            'social_youtube' => Setting::get('social_youtube', 'https://youtube.com/@eduviaschool'),
            'principal_name' => Setting::get('principal_name', 'Drs. H. Hendra Setiawan, M.Pd.'),
            'principal_title' => Setting::get('principal_title', 'Kepala Sekolah SMK Eduvia Nusantara'),
            'principal_photo' => Setting::get('principal_photo', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'),
            'principal_welcome' => Setting::get('principal_welcome', "Assalamu’alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di gerbang digital resmi SMK Eduvia Nusantara. Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual dan keahlian vokasional, melainkan juga menanamkan ketangguhan karakter, kejujuran budi pekerti, serta kesiapan menyongsong disrupsi peradaban global.\n\nDidukung tenaga pendidik berpengalaman, sarana laboratorium modern berbasis standar industri, serta kurikulum yang adaptif, kami berkomitmen mendampingi setiap peserta didik bertumbuh menjadi insan mandiri, berdaya saing internasional, dan berakhlak mulia. Mari melangkah bersama menuju masa depan gemilang."),
        ];
    }

    public function home(): Response
    {
        $posts = Post::with('author:id,name')
            ->published()
            ->latest('published_at')
            ->take(3)
            ->get();

        $facilities = Facility::active()
            ->orderBy('order')
            ->take(6)
            ->get();

        $stats = [
            'students_count' => Student::where('status', 'active')->count(),
            'teachers_count' => Teacher::where('is_active', true)->count(),
            'classrooms_count' => Classroom::count(),
            'departments_count' => Department::where('is_active', true)->count(),
        ];

        $departments = Department::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Public/Home', [
            'profile' => $this->getSchoolProfile(),
            'posts' => $posts,
            'facilities' => $facilities,
            'stats' => $stats,
            'departments' => $departments,
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Public/About', [
            'profile' => $this->getSchoolProfile(),
        ]);
    }

    public function facilities(): Response
    {
        $facilities = Facility::active()->get();

        return Inertia::render('Public/Facilities/Index', [
            'profile' => $this->getSchoolProfile(),
            'facilities' => $facilities,
        ]);
    }

    public function teachers(): Response
    {
        $teachers = Teacher::public()
            ->with(['currentHomeroomClassroom:id,name,homeroom_teacher_id'])
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Teachers/Index', [
            'profile' => $this->getSchoolProfile(),
            'teachers' => $teachers,
        ]);
    }

    public function galleries(): Response
    {
        $albums = GalleryAlbum::active()
            ->with(['galleries' => fn ($q) => $q->orderBy('order', 'asc')])
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Public/Galleries/Index', [
            'profile' => $this->getSchoolProfile(),
            'albums' => $albums,
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact', [
            'profile' => $this->getSchoolProfile(),
        ]);
    }

    public function submitContact(ContactMessageRequest $request, SubmitContactMessage $action): RedirectResponse
    {
        $action->execute($request->validated());

        return back()->with('success', 'Pesan Anda berhasil dikirim. Tim kami akan segera menanggapi.');
    }
}
