import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    FileSpreadsheet,
    Filter,
    Search,
    User,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ApplicantItem {
    id: number;
    registration_number: string;
    nisn: string;
    full_name: string;
    gender: string;
    distance_zone_score: number;
    average_report_score: string;
    final_score: string;
    ranking: number | null;
    verification_status: string;
    selection_status: string;
    re_registration_status: string;
    created_at: string;
    period?: { name: string };
    track?: { name: string; code: string };
    department?: { name: string; code: string };
}

interface ApplicantsProps {
    applicants: {
        data: ApplicantItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    periods: Array<{ id: number; name: string }>;
    tracks: Array<{ id: number; name: string; code: string }>;
    departments: Array<{ id: number; name: string; code: string }>;
    filters: {
        search?: string;
        period_id?: string;
        track_id?: string;
        department_id?: string;
        verification_status?: string;
        selection_status?: string;
    };
}

export default function ApplicantsIndex({
    applicants,
    periods,
    tracks,
    departments,
    filters,
}: ApplicantsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '');
    const [trackId, setTrackId] = useState(filters.track_id || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || '');
    const [verificationStatus, setVerificationStatus] = useState(filters.verification_status || '');
    const [selectionStatus, setSelectionStatus] = useState(filters.selection_status || '');

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('ppdb.applicants.index'),
            {
                search,
                period_id: periodId,
                track_id: trackId,
                department_id: departmentId,
                verification_status: verificationStatus,
                selection_status: selectionStatus,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setPeriodId('');
        setTrackId('');
        setDepartmentId('');
        setVerificationStatus('');
        setSelectionStatus('');
        router.get(route('ppdb.applicants.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Data Calon Siswa (PPDB)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Total {applicants.total} pendaftar tercatat dalam sistem.
                        </p>
                    </div>

                    <a
                        href={route('ppdb.export', {
                            period_id: periodId,
                            track_id: trackId,
                            verification_status: verificationStatus,
                            selection_status: selectionStatus,
                        })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Ekspor Excel</span>
                    </a>
                </div>
            }
        >
            <Head title="Data Pendaftar PPDB" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Filters Bar */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
                        <form onSubmit={handleFilter} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                                <div className="sm:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Cari nama, NISN, atau no. registrasi..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <select
                                        value={trackId}
                                        onChange={(e) => setTrackId(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Semua Jalur</option>
                                        {tracks.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Semua Kejuruan</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} ({d.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={verificationStatus}
                                        onChange={(e) => setVerificationStatus(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Status Verifikasi</option>
                                        <option value="pending">Menunggu</option>
                                        <option value="verified">Terverifikasi</option>
                                        <option value="needs_revision">Perlu Perbaikan</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={selectionStatus}
                                        onChange={(e) => setSelectionStatus(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Status Seleksi</option>
                                        <option value="accepted">Diterima</option>
                                        <option value="waiting_list">Cadangan</option>
                                        <option value="rejected">Tidak Diterima</option>
                                        <option value="unprocessed">Belum Diproses</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-medium"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold inline-flex items-center gap-1.5 shadow-sm"
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    <span>Terapkan Filter</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">No. Registrasi</th>
                                        <th className="px-6 py-3.5">Nama & NISN</th>
                                        <th className="px-6 py-3.5">Jalur & Kejuruan</th>
                                        <th className="px-6 py-3.5">Skor Zonasi & Rapor</th>
                                        <th className="px-6 py-3.5">Skor Akhir</th>
                                        <th className="px-6 py-3.5">Status Verifikasi</th>
                                        <th className="px-6 py-3.5">Status Seleksi</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {applicants.data.length > 0 ? (
                                        applicants.data.map((a) => (
                                            <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-blue-600">
                                                    {a.registration_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{a.full_name}</div>
                                                    <div className="text-[11px] text-slate-400 font-mono">
                                                        NISN: {a.nisn} ({a.gender === 'L' ? 'Laki-laki' : 'Perempuan'})
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{a.track?.name || '-'}</div>
                                                    <div className="text-[11px] text-slate-400">{a.department?.name || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 font-mono">
                                                    <div>Zonasi: <strong>Skor {a.distance_zone_score}</strong></div>
                                                    <div className="text-slate-400 text-[11px]">Rapor: {a.average_report_score}</div>
                                                </td>
                                                <td className="px-6 py-4 font-mono">
                                                    <span className="font-black text-blue-700 text-sm">
                                                        {a.final_score}
                                                    </span>
                                                    {a.ranking && (
                                                        <span className="text-[10px] text-slate-400 block">
                                                            Rank #{a.ranking}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {a.verification_status === 'verified' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Terverifikasi
                                                        </span>
                                                    )}
                                                    {a.verification_status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Clock className="w-3 h-3" />
                                                            Menunggu
                                                        </span>
                                                    )}
                                                    {a.verification_status === 'needs_revision' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Perbaikan
                                                        </span>
                                                    )}
                                                    {a.verification_status === 'rejected' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                                            <XCircle className="w-3 h-3" />
                                                            Ditolak
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {a.selection_status === 'accepted' && (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                                                            Diterima
                                                        </span>
                                                    )}
                                                    {a.selection_status === 'waiting_list' && (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
                                                            Cadangan
                                                        </span>
                                                    )}
                                                    {a.selection_status === 'rejected' && (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500">
                                                            Tersingkir
                                                        </span>
                                                    )}
                                                    {a.selection_status === 'unprocessed' && (
                                                        <span className="text-slate-400 text-[11px]">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('ppdb.applicants.show', a.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-xs transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Detail</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                                                Tidak ada calon siswa yang cocok dengan filter pencarian.
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

