import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Quote,
    Sparkles,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomeProps {
    profile: {
        school_name: string;
        school_tagline: string;
        school_logo?: string;
        school_description: string;
        school_vision: string;
        school_mission: string;
        school_address: string;
        school_phone: string;
        school_email: string;
        principal_name?: string;
        principal_title?: string;
        principal_photo?: string;
        principal_welcome?: string;
    };
    posts: Array<{
        id: number;
        title: string;
        slug: string;
        category: string;
        excerpt: string | null;
        featured_image: string | null;
        published_at: string;
        author?: { name: string };
    }>;
    facilities: Array<{
        id: number;
        name: string;
        description: string | null;
        image_path: string | null;
    }>;
    stats: {
        students_count: number;
        teachers_count: number;
        classrooms_count: number;
        departments_count: number;
    };
    departments: Array<{
        id: number;
        code: string;
        name: string;
    }>;
}

export default function Home({
    profile,
    posts,
    facilities,
    stats,
    departments,
}: HomeProps) {
    const categoryLabels: Record<string, { label: string; bg: string; text: string }> = {
        news: { label: 'Berita', bg: 'bg-blue-50', text: 'text-blue-700' },
        announcement: { label: 'Pengumuman', bg: 'bg-amber-50', text: 'text-amber-700' },
        achievement: { label: 'Prestasi', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        agenda: { label: 'Agenda', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    };

    // Siapkan foto fasilitas untuk background slider
    const facilitySlides = facilities
        .filter((f) => f.image_path)
        .map((f) => ({
            image: f.image_path!,
            name: f.name,
            description: f.description || 'Fasilitas sarana prasarana modern berstandar industri.',
        }));

    const fallbackSlides = [
        {
            image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
            name: 'Laboratorium Komputer & Jaringan',
            description: 'Workstation Core i7 mutakhir, server virtualisasi, dan software standar industri.',
        },
        {
            image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
            name: 'Perpustakaan & Pusat Riset Digital',
            description: 'Ribuan referensi buku sains, e-book ilmiah, dan ruang baca ber-AC yang nyaman.',
        },
        {
            image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80',
            name: 'Studio Multimedia & Podcast Edukasi',
            description: 'Peralatan broadcast audio podcast, tata cahaya pro, dan kamera rekaman mutakhir.',
        },
        {
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
            name: 'Gelanggang Olahraga & Aula Serbaguna',
            description: 'Area serbaguna berkapasitas 800 orang untuk seminar, kompetisi, dan olahraga.',
        },
    ];

    const slides = facilitySlides.length > 0 ? facilitySlides : fallbackSlides;

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 2000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const activeSlide = slides[currentSlide];

    return (
        <PublicLayout
            title="Beranda"
            description={profile.school_tagline}
            profile={profile}
        >
            {/* HERO SECTION WITH DARK CINEMATIC BACKGROUND SLIDER */}
            <section
                className="relative min-h-[640px] lg:min-h-[720px] overflow-hidden bg-slate-950 flex flex-col justify-center py-20 lg:py-28 border-b border-slate-900"
            >
                {/* Background Slider Images Stack */}
                <div className="absolute inset-0 z-0">
                    {slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.name}
                                className={`w-full h-full object-cover transform transition-transform duration-[3000ms] ease-out ${
                                    idx === currentSlide ? 'scale-105' : 'scale-100'
                                }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Cinematic Dark Overlays for High Text Contrast */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/70" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
                <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.18),transparent_70%)]" />

                {/* Foreground Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            {/* Logo & Nama Sekolah di Sebelah Kiri */}
                            <div className="flex items-center gap-3.5">
                                {profile.school_logo ? (
                                    <img
                                        src={profile.school_logo}
                                        alt={profile.school_name}
                                        className="h-14 w-14 shrink-0 object-contain rounded-2xl bg-white/10 p-1.5 border border-white/20 backdrop-blur-md shadow-lg"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <span className="block text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight truncate drop-shadow-sm">
                                        {profile.school_name}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 tracking-wide uppercase mt-0.5">
                                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                        Pusat Keunggulan Akademik & Vokasi
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
                                {profile.school_tagline}
                            </h1>

                            <p className="text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
                                {profile.school_description}
                            </p>

                            <div className="pt-2 flex flex-wrap gap-4 items-center">
                                <Link
                                    href={route('public.about')}
                                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
                                >
                                    Jelajahi Profil
                                    <ChevronRight className="w-4 h-4 ml-1.5" />
                                </Link>

                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 hover:border-white/30 backdrop-blur-md shadow-sm transition-all"
                                >
                                    Masuk ke Portal
                                    <ArrowRight className="w-4 h-4 ml-1.5 text-blue-400" />
                                </Link>
                            </div>

                            {/* Bullet highlights */}
                            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Kurikulum Standar Industri Terkini</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Fasilitas Laboratorium Modern</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Monitoring Akademik & Presensi Realtime</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Pendidikan Karakter & Akhlak Mulia</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Card (Glassmorphism) */}
                        <div className="lg:col-span-5">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl p-6 shadow-2xl border border-white/15 space-y-5 text-white">
                                    {/* Akreditasi Banner */}
                                    <div className="h-32 rounded-xl bg-gradient-to-tr from-blue-700/80 to-blue-500/80 p-5 text-white flex flex-col justify-between border border-white/10 shadow-inner">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs uppercase tracking-wider font-semibold opacity-95 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                                                Status Akreditasi
                                            </span>
                                            <Award className="w-5 h-5 text-blue-200" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-blue-100 font-medium block">
                                                Komitmen Mutu Lembaga
                                            </span>
                                            <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                                                Terakreditasi Unggul (A)
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Live Slide Highlight (Fasilitas yang Sedang Ditampilkan) */}
                                    {activeSlide && (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 transition-all">
                                            <div className="flex items-center justify-between text-xs text-blue-300 font-medium">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                                    Sarana Kampus Terpadu
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {currentSlide + 1} / {slides.length}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-semibold text-white truncate">
                                                {activeSlide.name}
                                            </h4>
                                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                                                {activeSlide.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                                        <span>Status: <strong className="text-emerald-400 font-semibold">Aktif & Terverifikasi</strong></span>
                                        <Link href={route('public.facilities')} className="text-blue-400 hover:text-blue-300 hover:underline">
                                            Lihat Semua Fasilitas →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Slider Controls */}
                    <div className="mt-12 pt-5 border-t border-white/10 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Slide Sebelumnya"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-2 rounded-full transition-all ${
                                        idx === currentSlide
                                            ? 'w-6 bg-blue-500'
                                            : 'w-2 bg-white/30 hover:bg-white/60'
                                    }`}
                                    aria-label={`Pindah ke slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={nextSlide}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Slide Berikutnya"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-12 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="inline-flex p-3 rounded-xl bg-blue-100 text-blue-700 mb-3">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.students_count > 0 ? stats.students_count : '500+'}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-1">
                                Peserta Didik Aktif
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="inline-flex p-3 rounded-xl bg-emerald-100 text-emerald-700 mb-3">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.teachers_count > 0 ? stats.teachers_count : '40+'}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-1">
                                Guru & Pendidik Ahli
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="inline-flex p-3 rounded-xl bg-indigo-100 text-indigo-700 mb-3">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.departments_count > 0 ? stats.departments_count : '5'}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-1">
                                Program Keahlian / Jurusan
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="inline-flex p-3 rounded-xl bg-amber-100 text-amber-700 mb-3">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">100%</div>
                            <div className="text-xs font-medium text-slate-500 mt-1">
                                Kelulusan & Sertifikasi
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAMBUTAN KEPALA SEKOLAH SECTION */}
            <section className="py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200/80 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        {/* Foto Kepala Sekolah (Left) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative max-w-sm sm:max-w-md w-full">
                                {/* Decorative glowing gradient backdrop */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-500/10 rounded-3xl blur-2xl -z-10" />
                                <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-blue-100 rounded-full blur-3xl -z-10" />

                                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-2xl">
                                    <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 relative group">
                                        <img
                                            src={profile.principal_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
                                            alt={profile.principal_name || 'Kepala Sekolah'}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                                        {/* Name overlay on photo */}
                                        <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-1">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                                                Kepala Sekolah
                                            </span>
                                            <h3 className="text-xl font-bold leading-tight drop-shadow-sm">
                                                {profile.principal_name || 'Drs. H. Hendra Setiawan, M.Pd.'}
                                            </h3>
                                            <p className="text-xs text-blue-100 font-normal">
                                                {profile.principal_title || 'Kepala Sekolah SMK Eduvia Nusantara'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teks Sambutan (Right) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pesan & Komitmen Kepemimpinan</span>
                            </div>

                            <div className="relative">
                                <Quote className="w-12 h-12 text-blue-100 absolute -top-4 -left-4 -z-10" />
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                                    Menyiapkan Generasi Unggul, Berkarakter Juara & Siap Menghadapi Masa Depan
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                                {profile.principal_welcome ? (
                                    profile.principal_welcome.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <>
                                        <p>
                                            Selamat datang di gerbang digital resmi {profile.school_name}. Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual dan keahlian vokasional, melainkan juga menanamkan ketangguhan karakter, kejujuran budi pekerti, serta kesiapan menyongsong disrupsi peradaban global.
                                        </p>
                                        <p>
                                            Didukung tenaga pendidik berpengalaman, sarana laboratorium modern berbasis standar industri, serta kurikulum yang adaptif, kami berkomitmen mendampingi setiap peserta didik bertumbuh menjadi insan mandiri, berdaya saing internasional, dan berakhlak mulia.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-100">
                                <Link
                                    href={route('public.about')}
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                                >
                                    <span>Baca Sambutan Lengkap & Visi Misi</span>
                                    <ChevronRight className="w-4 h-4 ml-1.5" />
                                </Link>

                                <div className="text-xs text-slate-500 font-medium pl-3 border-l-2 border-blue-600">
                                    <span className="block text-slate-900 font-bold">Terakreditasi A (Unggul)</span>
                                    <span>Standar Mutu Lembaga Terverifikasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAM JURUSAN SECTION */}
            {departments.length > 0 && (
                <section className="py-16 bg-slate-50 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                Pilihan Masa Depan
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                                Program Keahlian & Peminatan
                            </h2>
                            <p className="text-sm text-slate-600 mt-2 font-normal">
                                Dirancang selaras dengan kompetensi revolusi industri 4.0 dan kebutuhan dunia usaha & dunia industri (DUDI).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
                                            {dept.code}
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {dept.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                                            Fokus pada praktik intensif, sertifikasi kompetensi, dan magang di perusahaan mitra terpercaya.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-blue-600 flex items-center gap-1">
                                        <span>Jenjang Kelas 10, 11, 12</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* BERITA & INFORMASI TERBARU */}
            <section className="py-16 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                Kabar Sekolah
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                                Berita & Informasi Terkini
                            </h2>
                        </div>
                        <Link
                            href={route('public.posts.index')}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua Kabar
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {posts.map((post) => {
                                const cat = categoryLabels[post.category] || {
                                    label: post.category,
                                    bg: 'bg-slate-100',
                                    text: 'text-slate-700',
                                };

                                return (
                                    <article
                                        key={post.id}
                                        className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                                    >
                                        <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="text-slate-400 flex flex-col items-center">
                                                    <BookOpen className="w-10 h-10 stroke-[1.5]" />
                                                    <span className="text-xs mt-1">Dokumentasi Eduvia</span>
                                                </div>
                                            )}
                                            <span
                                                className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${cat.bg} ${cat.text}`}
                                            >
                                                {cat.label}
                                            </span>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-normal">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        {new Date(post.published_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    <Link href={route('public.posts.show', post.slug)}>
                                                        {post.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-slate-600 font-normal line-clamp-3 leading-relaxed">
                                                    {post.excerpt || 'Klik untuk membaca artikel selengkapnya.'}
                                                </p>
                                            </div>

                                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-xs text-slate-400 font-normal">
                                                    Oleh {post.author?.name || 'Humas'}
                                                </span>
                                                <Link
                                                    href={route('public.posts.show', post.slug)}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    Baca
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-sm">
                            Belum ada artikel atau berita yang dipublikasikan.
                        </div>
                    )}
                </div>
            </section>

            {/* FASILITAS SECTION */}
            {facilities.length > 0 && (
                <section className="py-16 bg-slate-50 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                            <div>
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                    Sarana & Prasarana
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                                    Fasilitas Kampus Unggulan
                                </h2>
                            </div>
                            <Link
                                href={route('public.facilities')}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Semua Fasilitas
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {facilities.map((facility) => (
                                <div
                                    key={facility.id}
                                    className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                                        {facility.image_path ? (
                                            <img
                                                src={facility.image_path}
                                                alt={facility.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                                        )}
                                    </div>
                                    <div className="p-4 space-y-1">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {facility.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">
                                            {facility.description || 'Fasilitas pembelajaran standar industri.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CALL TO ACTION HUBUNGI KAMI */}
            <section className="py-16 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Siap Menjadi Bagian dari Generasi Berprestasi?
                    </h2>
                    <p className="text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
                        Dapatkan informasi pendaftaran peserta didik baru (PPDB), konsultasi jurusan, serta kunjungan kampus sekarang juga.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-4">
                        <Link
                            href={route('public.contact')}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
                        >
                            Hubungi Layanan Informasi
                        </Link>
                        <Link
                            href={route('public.about')}
                            className="px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
                        >
                            Pelajari Profil Sekolah
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

