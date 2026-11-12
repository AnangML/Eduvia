import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Award,
    Calendar,
    CheckCircle,
    Clock,
    FileSpreadsheet,
    FileText,
    Layers,
    TrendingUp,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';

interface TrackStat {
    id: number;
    name: string;
    code: string;
    quota: number;
    total_count: number;
    verified_count: number;
    accepted_count: number;
}

interface DepartmentStat {
    id: number;
    name: string;
    code: string;
    first_choice_count: number;
}

interface RecentApplicant {
    id: number;
    registration_number: string;
    full_name: string;
    verification_status: string;
    selection_status: string;
    created_at: string;
    track?: { name: string; code: string };
    department?: { name: string; code: string };
}

interface DashboardProps {
    period: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
        announcement_date: string | null;
        is_active: boolean;
    } | null;
    stats: {
        total_applicants: number;
        verified_applicants: number;
        pending_verification: number;
        needs_revision: number;
        accepted_applicants: number;
        waiting_list_applicants: number;
        re_registered_applicants: number;
        converted_students: number;
    };
    tracksStats: TrackStat[];
    departmentsStats: DepartmentStat[];
    recentApplicants: RecentApplicant[];
}

export default function PpdbDashboard({
    period,
    stats,
    tracksStats,
    departmentsStats,
    recentApplicants,
}: DashboardProps) {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Dashboard PPDB Online
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {period ? `${period.name} (${formatDate(period.start_date)} - ${formatDate(period.end_date)})` : 'Tidak ada periode PPDB aktif.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('ppdb.export')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>Ekspor Excel</span>
                        </a>
                        <Link
                            href={route('ppdb.selection.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                        >
                            <Award className="w-4 h-4" />
                            <span>Simulasi Seleksi</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard PPDB Online" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Total Pendaftar</span>
                            <div className="text-2xl font-black text-slate-900 font-mono">
                                {stats.total_applicants}
                            </div>
                            <span className="text-[11px] text-slate-400">Seluruh jalur</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Terverifikasi</span>
                            <div className="text-2xl font-black text-emerald-600 font-mono">
                                {stats.verified_applicants}
                            </div>
                            <span className="text-[11px] text-emerald-600 font-medium">Berkas lengkap</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Menunggu Review</span>
                            <div className="text-2xl font-black text-amber-600 font-mono">
                                {stats.pending_verification}
                            </div>
                            <span className="text-[11px] text-amber-600 font-medium">Perlu diperiksa</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Perlu Perbaikan</span>
                            <div className="text-2xl font-black text-rose-600 font-mono">
                                {stats.needs_revision}
                            </div>
                            <span className="text-[11px] text-rose-600 font-medium">Berkas kurang</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Lolos Seleksi</span>
                            <div className="text-2xl font-black text-blue-600 font-mono">
                                {stats.accepted_applicants}
                            </div>
                            <span className="text-[11px] text-blue-600 font-medium">Diterima</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                            <span className="text-xs font-medium text-slate-500">Siswa Aktif</span>
                            <div className="text-2xl font-black text-indigo-600 font-mono">
                                {stats.converted_students}
                            </div>
                            <span className="text-[11px] text-indigo-600 font-medium">Terkonversi 1-klik</span>
                        </div>
                    </div>

                    {/* Progress Kuota per Jalur & Minat Jurusan */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Jalur Pendaftaran & Kuota */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-blue-600" />
                                    <span>Kuota & Keterisian per Jalur</span>
                                </h3>
                                <Link
                                    href={route('ppdb.periods.index')}
                                    className="text-xs font-semibold text-blue-600 hover:underline"
                                >
                                    Kelola Kuota
                                </Link>
                            </div>

                            <div className="space-y-4 text-xs">
                                {tracksStats.map((track) => {
                                    const percent = track.quota > 0 ? Math.min(100, Math.round((track.accepted_count / track.quota) * 100)) : 0;
                                    return (
                                        <div key={track.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-slate-800">
                                                    {track.name} ({track.code})
                                                </span>
                                                <span className="text-slate-500">
                                                    <strong>{track.accepted_count}</strong> / {track.quota} kuota ({percent}%)
                                                </span>
                                            </div>
                                            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                <span>Pendaftar Masuk: {track.total_count}</span>
                                                <span>Terverifikasi: {track.verified_count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pilihan Program Keahlian / Jurusan */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <span>Peminatan Program Keahlian (Pilihan Utama)</span>
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                {departmentsStats.map((dept) => (
                                    <div
                                        key={dept.id}
                                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-bold text-slate-900">{dept.name}</div>
                                            <div className="text-[11px] text-slate-400 font-mono">Kode: {dept.code}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-black text-slate-900 font-mono">
                                                {dept.first_choice_count}
                                            </span>
                                            <span className="text-[11px] text-slate-400 block">Pendaftar</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Applicants Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-blue-600" />
                                <span>Pendaftar Terbaru</span>
                            </h3>
                            <Link
                                href={route('ppdb.applicants.index')}
                                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <span>Lihat Seluruh Pendaftar</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">No. Registrasi</th>
                                        <th className="px-6 py-3">Nama Siswa</th>
                                        <th className="px-6 py-3">Jalur & Pilihan</th>
                                        <th className="px-6 py-3">Status Verifikasi</th>
                                        <th className="px-6 py-3">Status Kelulusan</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {recentApplicants.length > 0 ? (
                                        recentApplicants.map((a) => (
                                            <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-3.5 font-mono font-semibold text-blue-600">
                                                    {a.registration_number}
                                                </td>
                                                <td className="px-6 py-3.5 font-bold text-slate-900">
                                                    {a.full_name}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div>{a.track?.name || '-'}</div>
                                                    <div className="text-[11px] text-slate-400">{a.department?.name || '-'}</div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    {a.verification_status === 'verified' && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Terverifikasi
                                                        </span>
                                                    )}
                                                    {a.verification_status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
                                                            <Clock className="w-3 h-3" />
                                                            Menunggu
                                                        </span>
                                                    )}
                                                    {a.verification_status === 'needs_revision' && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Perbaikan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    {a.selection_status === 'accepted' ? (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                                                            Diterima
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px]">Belum Diproses</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <Link
                                                        href={route('ppdb.applicants.show', a.id)}
                                                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-xs transition-colors"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                                Belum ada calon siswa yang mendaftar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

