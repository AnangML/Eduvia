import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    CalendarCheck,
    CreditCard,
    GraduationCap,
    ShieldAlert,
    TrendingUp,
    Users,
} from 'lucide-react';

export default function Dashboard() {
    const { auth, school } = usePage().props;
    const user = auth.user;
    const userRoles = user.roles || [];
    const isSuperAdmin = userRoles.includes('super_admin');

    const stats = [
        {
            title: 'Siswa Terdaftar',
            value: '0',
            unit: 'siswa',
            description: 'Tahun Ajaran 2026/2027',
            icon: GraduationCap,
            accent: 'text-brand-600 bg-brand-50 border-brand-100',
        },
        {
            title: 'Guru & Tenaga Pendidik',
            value: '0',
            unit: 'guru',
            description: 'Aktif mengajar',
            icon: Users,
            accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        },
        {
            title: 'Rombongan Belajar',
            value: '0',
            unit: 'kelas',
            description: 'Tingkat X, XI, XII',
            icon: BookOpen,
            accent: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        },
        {
            title: 'SSP Terbayar',
            value: 'Rp 0',
            unit: '',
            description: 'Bulan berjalan',
            icon: CreditCard,
            accent: 'text-amber-600 bg-amber-50 border-amber-100',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Dashboard
                </h1>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200/60 mb-3">
                            <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                            {school?.name || 'SMK Eduvia Nusantara'} • Phase 0 Fondasi Aktif
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Halo, {user.name}! 👋
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                            Selamat datang di sistem manajemen sekolah terpadu Eduvia. Fondasi sistem, role otorisasi, dan database PostgreSQL telah siap beroperasi.
                        </p>
                    </div>
                </div>

                {/* Metric Statistics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500">
                                        {stat.title}
                                    </span>
                                    <div className={`rounded-xl border p-2.5 ${stat.accent}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-baseline gap-1.5">
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.unit && (
                                        <span className="text-xs font-medium text-slate-500">
                                            {stat.unit}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {stat.description}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* System Status / Phase 0 Overview */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    Status Kesiapan Sistem
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Checklist verifikasi Definition of Done (DoD) Phase 0
                                </p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                                Fondasi Siap
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">
                                            Database PostgreSQL 15+
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Koneksi aktif pada database: eduvia
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">Terhubung</span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">
                                            Sistem Otorisasi (8 Roles RBAC)
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Super Admin, Admin, Guru, Wali Kelas, Siswa, Wali Murid
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">Aktif</span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">
                                            Frontend Stack (Inertia + React + TS)
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Tailwind CSS v3/v4 • Plus Jakarta Sans • Formula 60-30-10
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">Compiled</span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">
                                            Audit Logging & Pencegahan N+1 Query
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Strict lazy loading prevention di AppServiceProvider
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">Enforced</span>
                            </div>
                        </div>
                    </div>

                    {/* Role Info Card */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Info Sesi Pengguna
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Kredensial aktif saat ini
                            </p>

                            <div className="mt-4 space-y-2.5 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Nama Akun</span>
                                    <span className="font-semibold text-slate-800">{user.name}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Email</span>
                                    <span className="font-semibold text-slate-800">{user.email}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Username</span>
                                    <span className="font-semibold text-slate-800">{user.username || '-'}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Peran Sistem</span>
                                    <span className="font-semibold text-brand-600">
                                        {userRoles.join(', ') || 'user'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-xs text-blue-800">
                            💡 <strong>Langkah Berikutnya:</strong> Siap melanjutkan ke <strong>Phase 1</strong> (Master Data Akademik & Mata Pelajaran).
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
