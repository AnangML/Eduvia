import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    CheckCircle,
    Clock,
    FileSpreadsheet,
    Filter,
    HelpCircle,
    Layers,
    MapPin,
    Play,
    Sparkles,
    Users,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface TrackItem {
    id: number;
    name: string;
    code: string;
    quota: number;
}

interface DepartmentItem {
    id: number;
    name: string;
    code: string;
}

interface ApplicantItem {
    id: number;
    registration_number: string;
    nisn: string;
    full_name: string;
    previous_school_name: string;
    district: string;
    city: string;
    distance_zone_score: number;
    average_report_score: string;
    final_score: string;
    ranking: number | null;
    selection_status: string;
    created_at: string;
    track?: { name: string; code: string };
    department?: { name: string; code: string };
}

interface SelectionProps {
    periods: Array<{ id: number; name: string }>;
    tracks: TrackItem[];
    departments: DepartmentItem[];
    selectedPeriodId: number | string;
    selectedTrack: TrackItem | null;
    selectedDepartmentId: number | string | null;
    applicants: ApplicantItem[];
}

export default function SelectionIndex({
    periods,
    tracks,
    departments,
    selectedPeriodId,
    selectedTrack,
    selectedDepartmentId,
    applicants,
}: SelectionProps) {
    const [periodId, setPeriodId] = useState(selectedPeriodId);
    const [trackId, setTrackId] = useState(selectedTrack?.id || '');
    const [departmentId, setDepartmentId] = useState(selectedDepartmentId || '');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('ppdb.selection.index'),
            {
                period_id: periodId,
                track_id: trackId,
                department_id: departmentId,
            },
            { preserveState: true }
        );
    };

    const quota = selectedTrack?.quota || 30;
    const waitingQuota = Math.max(5, Math.round(quota * 0.2));

    const handleRunSelection = () => {
        if (!confirm(`Jalankan seleksi eliminasi untuk jalur "${selectedTrack?.name || 'Semua'}" dengan kuota ${quota} siswa? Status seleksi calon siswa akan otomatis ditetapkan.`)) {
            return;
        }

        setIsProcessing(true);
        router.post(
            route('ppdb.selection.run'),
            {
                period_id: periodId,
                track_id: trackId,
                department_id: departmentId,
            },
            {
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span>Simulasi & Penetapan Seleksi Eliminasi PPDB</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Perangkingan otomatis berbasis skor jarak zonasi (3/2/1) dan rata-rata nilai rapor.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRunSelection}
                            disabled={isProcessing || applicants.length === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{isProcessing ? 'Memproses...' : 'Terapkan Eliminasi Otomatis'}</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Seleksi Eliminasi PPDB" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Filter Scope Bar */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
                        <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="min-w-[200px]">
                                <select
                                    value={periodId}
                                    onChange={(e) => setPeriodId(e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 font-semibold"
                                >
                                    {periods.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="min-w-[180px]">
                                <select
                                    value={trackId}
                                    onChange={(e) => setTrackId(e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Semua Jalur</option>
                                    {tracks.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} (Kuota: {t.quota})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="min-w-[180px]">
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Semua Program Keahlian</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name} ({d.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold inline-flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                            </button>
                        </form>
                    </div>

                    {/* Kuota & Summary Banner */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                                Parameter Jalur: {selectedTrack?.name || 'Seluruh Jalur'}
                            </span>
                            <h3 className="text-lg font-bold">
                                Daya Tampung Kuota: <span className="font-mono text-cyan-300">{quota} Siswa</span>
                            </h3>
                            <p className="text-xs text-slate-300">
                                Peringkat 1 s/d {quota} berstatus <strong>Diterima</strong>. Peringkat {quota + 1} s/d {quota + waitingQuota} berstatus <strong>Cadangan</strong>. Selebihnya <strong>Tereliminasi</strong>.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                                <div className="text-xl font-black font-mono">{applicants.length}</div>
                                <div className="text-[10px] text-slate-300">Pendaftar Terverifikasi</div>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Live Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5 w-16 text-center">Rank</th>
                                        <th className="px-6 py-3.5">Nama & No. Registrasi</th>
                                        <th className="px-6 py-3.5">Asal Sekolah</th>
                                        <th className="px-6 py-3.5">Domisili & Skor Zonasi</th>
                                        <th className="px-6 py-3.5">Nilai Rapor</th>
                                        <th className="px-6 py-3.5">Total Skor Akhir</th>
                                        <th className="px-6 py-3.5 text-center">Hasil Simulasi Eliminasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {applicants.length > 0 ? (
                                        applicants.map((a, idx) => {
                                            const rank = idx + 1;
                                            const isAccepted = rank <= quota;
                                            const isWaiting = rank > quota && rank <= (quota + waitingQuota);
                                            const isRejected = rank > (quota + waitingQuota);

                                            const showCutoff = rank === quota;

                                            return (
                                                <tr
                                                    key={a.id}
                                                    className={`transition-colors ${
                                                        isAccepted
                                                            ? 'hover:bg-emerald-50/40 bg-white'
                                                            : isWaiting
                                                            ? 'hover:bg-amber-50/40 bg-amber-50/10'
                                                            : 'hover:bg-slate-100/50 bg-slate-50/30 text-slate-400'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold ${
                                                                rank === 1
                                                                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                                                                    : rank <= quota
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : rank <= quota + waitingQuota
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-slate-100 text-slate-500'
                                                            }`}
                                                        >
                                                            #{rank}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{a.full_name}</div>
                                                        <div className="text-[11px] font-mono text-blue-600 mt-0.5">
                                                            {a.registration_number} • NISN: {a.nisn}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-800">{a.previous_school_name}</div>
                                                        <div className="text-[11px] text-slate-400">Pilihan: {a.department?.name || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 font-semibold">
                                                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>Skor {a.distance_zone_score}</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400">Kec. {a.district}, {a.city}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                                                        {a.average_report_score}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono">
                                                        <span className="text-sm font-black text-blue-700">
                                                            {a.final_score}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {isAccepted && (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                <span>Lolos Kuota (Diterima)</span>
                                                            </span>
                                                        )}
                                                        {isWaiting && (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span>Cadangan / Waiting List</span>
                                                            </span>
                                                        )}
                                                        {isRejected && (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200 text-slate-600">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                <span>Tereliminasi</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                                Tidak ada calon siswa terverifikasi pada filter jalur ini.
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

