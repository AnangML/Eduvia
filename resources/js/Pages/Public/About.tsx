import PublicLayout from '@/Layouts/PublicLayout';
import { Award, Compass, GraduationCap, History, Quote, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';

interface AboutProps {
    profile: {
        school_name: string;
        school_tagline: string;
        school_logo?: string;
        school_description: string;
        school_vision: string;
        school_mission: string;
        school_history: string;
        school_address: string;
        school_phone: string;
        school_email: string;
        principal_name?: string;
        principal_title?: string;
        principal_photo?: string;
        principal_welcome?: string;
    };
}

export default function About({ profile }: AboutProps) {
    const missions = profile.school_mission
        ? profile.school_mission.split('\n').filter((item) => item.trim() !== '')
        : [
              'Mengembangkan kurikulum relevan industri dan berbasis kompetensi masa depan.',
              'Menumbuhkan integritas, etika profesional, dan karakter akhlak mulia.',
              'Menyediakan fasilitas pembelajaran berbasis sains dan teknologi mutakhir.',
              'Membangun jejaring kemitraan strategis dengan dunia usaha dan dunia industri.',
          ];

    return (
        <PublicLayout
            title="Tentang Sekolah & Visi Misi"
            description={`Profil resmi, visi misi, dan sejarah dedikasi ${profile.school_name}.`}
            profile={profile}
        >
            {/* Header Banner */}
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <div className="flex items-center gap-3.5">
                        {profile.school_logo ? (
                            <img
                                src={profile.school_logo}
                                alt={profile.school_name}
                                className="h-12 w-12 shrink-0 object-contain rounded-2xl bg-white p-1 border border-slate-200 shadow-sm"
                            />
                        ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                        )}
                        <div>
                            <span className="block text-xl font-bold text-slate-900 leading-tight">
                                {profile.school_name}
                            </span>
                            <span className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                                Tentang Institusi & Profil Keunggulan
                            </span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Profil, Visi Misi & Dedikasi
                    </h1>
                    <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                        Mengenal lebih dekat visi, nilai luhur, dan komitmen {profile.school_name} dalam membentuk generasi penerus bangsa yang kompeten dan berakhlak mulia.
                    </p>
                </div>
            </div>

            {/* Visi, Misi & Sambutan */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
                {/* Sambutan Resmi Kepala Sekolah */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg p-8 sm:p-12 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-4 flex justify-center">
                            <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md group">
                                <img
                                    src={profile.principal_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
                                    alt={profile.principal_name || 'Kepala Sekolah'}
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 inset-x-0 p-4 text-white text-center">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">
                                        Pimpinan Lembaga
                                    </span>
                                    <h4 className="text-sm font-bold truncate">
                                        {profile.principal_name || 'Drs. H. Hendra Setiawan, M.Pd.'}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                <Quote className="w-3.5 h-3.5" />
                                <span>Sambutan Resmi Kepala Sekolah</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                                Menumbuhkan Insan Berkarakter, Cakap Teknologi, & Berdaya Saing Global
                            </h2>

                            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-normal">
                                {profile.principal_welcome ? (
                                    profile.principal_welcome.split('\n\n').map((para, idx) => (
                                        <p key={idx}>{para}</p>
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

                            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 mt-4">
                                <strong className="text-slate-900 block font-bold text-sm">
                                    {profile.principal_name || 'Drs. H. Hendra Setiawan, M.Pd.'}
                                </strong>
                                <span>{profile.principal_title || 'Kepala Sekolah SMK Eduvia Nusantara'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Visi Card */}
                    <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-blue-100 text-blue-600 mb-4">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">
                                Visi Sekolah
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed font-normal">
                                &ldquo;{profile.school_vision}&rdquo;
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
                            Komitmen Jangka Panjang Menuju Keunggulan Vokasi & Karakter
                        </div>
                    </div>

                    {/* Misi Card */}
                    <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                                <Compass className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">
                                Misi Strategis
                            </h2>
                            <ul className="space-y-3 text-sm text-slate-600 font-normal">
                                {missions.map((mission, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <span className="leading-relaxed">{mission}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
                            Pedoman Kerja Seluruh Civitas Akademika
                        </div>
                    </div>
                </div>

                {/* Sejarah Lembaga */}
                <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Sejarah & Perjalanan Dedikasi
                            </h2>
                            <span className="text-xs text-slate-500 font-normal">
                                Jejak langkah pengembangan institusi
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 font-normal leading-relaxed space-y-4">
                        <p>{profile.school_history}</p>
                        <p>
                            Sejak awal berdirinya, {profile.school_name} terus bertransformasi mengadopsi standar teknologi digital modern guna memberikan pengalaman belajar yang komprehensif, terstruktur, serta membuka peluang kerja dan studi lanjut yang luas bagi seluruh alumni.
                        </p>
                    </div>
                </div>

                {/* Nilai Budaya Sekolah */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                            Pondasi Karakter
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                            Nilai-Nilai Utama (Core Values)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Integritas & Kejujuran
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                Menjunjung tinggi kejujuran akademik, etika moral, dan tanggung jawab sosial dalam setiap langkah.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Keunggulan Kompetensi
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                Senantiasa berorientasi pada standar tertinggi dan pencapaian prestasi di bidang vokasi maupun sains.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Kolaborasi & Kemitraan
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                Membina sinergi harmonis antara sekolah, orang tua siswa, industri, dan masyarakat luas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

