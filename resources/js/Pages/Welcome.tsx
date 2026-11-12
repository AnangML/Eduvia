import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    CreditCard,
    FileText,
    GraduationCap,
    Lock,
    School,
    Shield,
    Sparkles,
    UserCheck,
} from 'lucide-react';

export default function Welcome({ auth, school }: PageProps) {
    const schoolName = school?.name || 'SMK Eduvia Nusantara';

    const features = [
        {
            title: 'Master Akademik Terpadu',
            desc: 'Pengaturan tahun ajaran, semester, tingkatan, rombel/kelas, dan penugasan guru secara terstruktur.',
            icon: GraduationCap,
        },
        {
            title: 'Rekap Absensi Harian & Mapel',
            desc: 'Pencatatan kehadiran siswa cepat oleh wali kelas atau guru mata pelajaran dengan audit log lengkap.',
            icon: UserCheck,
        },
        {
            title: 'Raport Kurikulum Merdeka',
            desc: 'Perhitungan nilai otomatis, catatan capaian kompetensi, dan cetak PDF raport resmi sekolah.',
            icon: FileText,
        },
        {
            title: 'Pembayaran SSP & Midtrans',
            desc: 'Pengelolaan tagihan SPP bulanan, pembayaran otomatis via Midtrans Snap (QRIS, VA, E-Wallet), serta pencatatan manual.',
            icon: CreditCard,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <Head title="Sistem Informasi & Administrasi Sekolah Terpadu" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo />
                    </Link>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition"
                            >
                                Buka Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition"
                            >
                                Masuk ke Portal
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative overflow-hidden py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200/80 px-3.5 py-1 text-xs font-semibold text-brand-700 mb-6">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Platform Sekolah Terpadu Generasi Baru</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
                            Satu Sistem untuk Seluruh Alur Sekolah
                        </h1>

                        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Mengintegrasikan master data akademik, absensi siswa, raport digital Kurikulum Merdeka, serta pembayaran SSP dengan payment gateway Midtrans.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                                >
                                    Masuk ke Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                                >
                                    Login Pengguna (Email / NIP / NISN)
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>

                        {/* Security & Reliability Callout */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                Multi-Role RBAC (8 Peran)
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                Database PostgreSQL Berindeks
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                Audit Log Setiap Perubahan Sensitif
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-12 bg-white border-y border-slate-200/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Fitur Utama Eduvia
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Dirancang secara clean dan modular sesuai standar Kurikulum Merdeka.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md"
                                    >
                                        <div className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600 border border-brand-100">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                        &copy; {new Date().getFullYear()} {schoolName} • Ditenagai oleh Eduvia.
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Clean & Elegan UI</span>
                        <span>•</span>
                        <span>PostgreSQL Powered</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
