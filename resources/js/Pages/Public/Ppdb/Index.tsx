import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck2,
    FileText,
    HelpCircle,
    Info,
    Layers,
    MapPin,
    Search,
    ShieldAlert,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';

interface PpdbTrack {
    id: number;
    name: string;
    code: string;
    quota: number;
    description: string | null;
}

interface PpdbPeriod {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    announcement_date: string | null;
    re_registration_start: string | null;
    re_registration_end: string | null;
    is_active: boolean;
    description: string | null;
    tracks: PpdbTrack[];
}

interface Department {
    id: number;
    name: string;
    code: string;
    description: string | null;
}

interface PpdbIndexProps {
    period: PpdbPeriod | null;
    departments: Department[];
    schoolSettings: Record<string, string>;
}

export default function PpdbIndex({ period, departments, schoolSettings }: PpdbIndexProps) {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const isOpen = period && period.is_active;

    const steps = [
        {
            num: '01',
            title: 'Isi Formulir & Upload Berkas',
            desc: 'Lengkapi data identitas calon siswa, asal sekolah, data orang tua, dan unggah scan KK, Akta Lahir, Pas Foto, serta SKL/Rapor.',
            icon: FileText,
        },
        {
            num: '02',
            title: 'Verifikasi Berkas Panitia',
            desc: 'Panitia PPDB memeriksa kelengkapan berkas fisik & digital. Status verifikasi dapat dipantau mandiri secara real-time.',
            icon: FileCheck2,
        },
        {
            num: '03',
            title: 'Seleksi & Eliminasi Terpadu',
            desc: 'Sistem merangking pendaftar terverifikasi berdasarkan bobot zonasi jarak (skor 3/2/1) dan rata-rata nilai rapor.',
            icon: Award,
        },
        {
            num: '04',
            title: 'Daftar Ulang & Akun Siswa',
            desc: 'Calon siswa yang lolos seleksi melakukan daftar ulang dan otomatis tercatat sebagai Siswa Aktif master data sekolah.',
            icon: UserCheck,
        },
    ];

    const faqs = [
        {
            q: 'Bagaimana cara mengecek status pendaftaran saya?',
            a: 'Anda tidak perlu membuat akun terlebih dahulu. Cukup klik menu "Cek Status", masukkan Nomor Registrasi (atau NISN) beserta Tanggal Lahir Anda.',
        },
        {
            q: 'Bagaimana sistem seleksi & perangkingan eliminasi bekerja?',
            a: 'Seleksi dilakukan transparan berdasarkan skor jarak zonasi (Satu Kecamatan: 3 poin, Satu Kota: 2 poin, Satu Provinsi: 1 poin) dikombinasikan dengan rata-rata nilai rapor. Pendaftar diurutkan dari skor tertinggi hingga kuota terpenuhi.',
        },
        {
            q: 'Apa yang harus dilakukan jika berkas saya dinyatakan "Perlu Perbaikan"?',
            a: 'Anda dapat masuk ke halaman Cek Status, melihat catatan perbaikan dari panitia, dan mengunggah ulang dokumen yang buram atau salah tanpa perlu mendaftar ulang dari awal.',
        },
        {
            q: 'Apakah bisa memilih lebih dari satu program keahlian / jurusan?',
            a: 'Bisa. Sistem menyediakan pilihan jurusan utama (pilihan 1) dan jurusan alternatif (pilihan 2) jika kuota pilihan utama telah terpenuhi.',
        },
    ];

    return (
        <PublicLayout
            title="PPDB Online"
            description={`Penerimaan Peserta Didik Baru ${schoolSettings.school_name || 'SMK Eduvia Nusantara'} - Pendaftaran Online Transparan dan Terpadu.`}
        >
            <Head title="PPDB Online - Penerimaan Peserta Didik Baru" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-20 lg:py-28">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Penerimaan Peserta Didik Baru (PPDB)</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            Wujudkan Masa Depan Gemilang di{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                                {schoolSettings.school_name || 'SMK Eduvia Nusantara'}
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                            Portal pendaftaran online resmi, cepat, dan transparan dengan seleksi terpadu zonasi & prestasi akademik.
                        </p>

                        {/* Status Period Badge & Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {isOpen ? (
                                <>
                                    <Link
                                        href={route('public.ppdb.register')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Daftar Sekarang</span>
                                    </Link>
                                    <Link
                                        href={route('public.ppdb.check-status')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-all"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Cek Status Pendaftaran</span>
                                    </Link>
                                </>
                            ) : (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                                    <span>Pendaftaran PPDB saat ini sedang belum dibuka atau telah berakhir.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Period Timeline Info Box */}
                    {period && (
                        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                <div>
                                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                        Gelombang Aktif
                                    </span>
                                    <h3 className="text-lg font-bold text-white mt-1">
                                        {period.name}
                                    </h3>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold self-start sm:self-auto">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <span>Pendaftaran Terbuka</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-slate-400">Periode Pendaftaran</div>
                                        <div className="font-semibold text-white mt-0.5">
                                            {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Award className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-slate-400">Pengumuman Hasil</div>
                                        <div className="font-semibold text-white mt-0.5">
                                            {formatDate(period.announcement_date)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-slate-400">Jadwal Daftar Ulang</div>
                                        <div className="font-semibold text-white mt-0.5">
                                            {formatDate(period.re_registration_start)} - {formatDate(period.re_registration_end)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Jalur Pendaftaran Section */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Jalur Penerimaan
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                            Pilihan Jalur Pendaftaran Sesuai Kebutuhan Anda
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                            Setiap jalur memiliki kuota penerimaan dan kriteria seleksi yang transparan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {period?.tracks && period.tracks.length > 0 ? (
                            period.tracks.map((track) => (
                                <div
                                    key={track.id}
                                    className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold text-[11px] font-mono">
                                                {track.code}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                Kuota: <strong className="text-slate-900">{track.quota}</strong>
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {track.name}
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            {track.description || 'Jalur seleksi penerimaan resmi sekolah.'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-400 py-8">
                                Belum ada data jalur pendaftaran aktif.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sistem Seleksi Eliminasi & Zonasi Explanation */}
            <section className="py-16 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Sistem Seleksi & Perangkingan Eliminasi
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Standar penilaian berkeadilan berbasis jarak domisili dan prestasi nilai rapor.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                            <p>
                                Sistem seleksi Eduvia bekerja otomatis dengan formula skor gabungan:
                            </p>
                            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 font-mono text-center text-blue-900 text-xs sm:text-sm font-semibold">
                                Total Skor = (Skor Zonasi Wilayah × 100) + Rata-rata Nilai Rapor
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                                    <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span>Skor 3 (Tertinggi)</span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                        Satu Kelurahan atau Kecamatan dengan lokasi sekolah.
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                                    <div className="font-bold text-blue-700 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span>Skor 2</span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                        Satu Kota / Kabupaten dengan lokasi sekolah.
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                                    <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span>Skor 1</span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                        Satu Provinsi dengan lokasi sekolah (luar kota).
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 italic pt-2">
                                * Pendaftar diperingkatkan dari skor tertinggi hingga kuota terpenuhi. Calon siswa di luar batas kuota utama berstatus sebagai cadangan atau tereliminasi secara otomatis dan transparan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alur Pendaftaran */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Tata Cara
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                            Alur Pendaftaran PPDB 4 Langkah Mudah
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((st) => {
                            const IconComponent = st.icon;
                            return (
                                <div key={st.num} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
                                    <span className="text-3xl font-black text-slate-200 absolute top-3 right-4 select-none">
                                        {st.num}
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        {st.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {st.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Dokumen Persyaratan & FAQ */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Persyaratan Dokumen */}
                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                    Kelengkapan Berkas
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                                    Dokumen yang Wajib Disiapkan
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Pastikan scan dokumen terlihat jelas (format JPG, PNG, atau PDF maks. 3-4MB).
                                </p>
                            </div>

                            <div className="space-y-3 text-xs">
                                {[
                                    { title: 'Pas Foto Formal (3x4)', desc: 'Foto formal terbaru dengan latar belakang polos.' },
                                    { title: 'Kartu Keluarga (KK)', desc: 'Scan/foto KK asli untuk verifikasi domisili zonasi.' },
                                    { title: 'Akta Kelahiran', desc: 'Scan asli akta kelahiran calon peserta didik.' },
                                    { title: 'Ijazah / Surat Keterangan Lulus (SKL) / Rapor', desc: 'Dokumen bukti kelulusan SMP/MTs sederajat beserta nilai rapor.' },
                                    { title: 'Piagam / Sertifikat Prestasi (Opsional)', desc: 'Khusus pendaftar Jalur Prestasi (kejuaraan minimal tingkat kota/kabupaten).' },
                                    { title: 'Kartu Bantuan KIP / PKH / KKS (Opsional)', desc: 'Khusus pendaftar Jalur Afirmasi prasejahtera.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-slate-900">{item.title}</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                    Pusat Bantuan
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                                    Pertanyaan Sering Diajukan (FAQ)
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Informasi praktis terkait pelaksanaan PPDB online.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1.5 text-xs">
                                        <div className="font-bold text-slate-900 flex items-start gap-2">
                                            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                            <span>{faq.q}</span>
                                        </div>
                                        <p className="text-slate-600 pl-6 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

