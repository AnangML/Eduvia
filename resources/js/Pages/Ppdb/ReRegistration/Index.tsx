import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    CheckCircle,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    Sparkles,
    User,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ConvertedStudent {
    id: number;
    nis: string;
    nisn: string;
}

interface ApplicantItem {
    id: number;
    registration_number: string;
    nisn: string;
    full_name: string;
    phone_number: string;
    re_registration_status: string;
    converted_to_student_id: number | null;
    converted_at: string | null;
    track?: { name: string; code: string };
    department?: { name: string; code: string };
    converted_to_student?: ConvertedStudent;
}

interface ReRegistrationProps {
    applicants: {
        data: ApplicantItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    periods: Array<{ id: number; name: string }>;
    selectedPeriodId: number | string | null;
}

export default function ReRegistrationIndex({
    applicants,
    periods,
    selectedPeriodId,
}: ReRegistrationProps) {
    const [periodId, setPeriodId] = useState(selectedPeriodId || '');
    const [convertingId, setConvertingId] = useState<number | null>(null);

    const handlePeriodChange = (val: string) => {
        setPeriodId(val);
        router.get(route('ppdb.re-registration.index'), { period_id: val }, { preserveState: true });
    };

    const toggleReRegistration = (applicant: ApplicantItem) => {
        router.post(route('ppdb.applicants.toggle-re-registration', applicant.id));
    };

    const handleConvert = (applicant: ApplicantItem) => {
        if (!confirm(`Konversi calon siswa "${applicant.full_name}" menjadi Siswa Aktif master data sekolah beserta pembuatan akun login?`)) {
            return;
        }

        setConvertingId(applicant.id);
        router.post(
            route('ppdb.applicants.convert', applicant.id),
            {},
            {
                onFinish: () => setConvertingId(null),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-indigo-600" />
                            <span>Daftar Ulang & Konversi Siswa Aktif</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola calon siswa yang telah lolos seleksi dan konversikan 1-klik menjadi siswa aktif.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={periodId}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="rounded-xl border-slate-200 text-xs font-semibold focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Gelombang</option>
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Daftar Ulang & Konversi Siswa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Info Card */}
                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-start gap-3 text-xs text-indigo-900">
                        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold">Otomatisasi Konversi Siswa (1-Klik):</div>
                            <p className="text-indigo-800 text-[11px] mt-0.5 leading-relaxed">
                                Tombol konversi akan otomatis membuat data Siswa Aktif di master data (Phase 1), menyusun data Orang Tua / Wali di tabel wali murid, serta membuatkan akun login siswa aktif (username: NISN, password default: tanggal lahir).
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">No. Registrasi</th>
                                        <th className="px-6 py-3.5">Nama Calon Siswa</th>
                                        <th className="px-6 py-3.5">Jalur & Kejuruan</th>
                                        <th className="px-6 py-3.5">Status Daftar Ulang</th>
                                        <th className="px-6 py-3.5">Status Siswa Master Data</th>
                                        <th className="px-6 py-3.5 text-right">Aksi Konversi</th>
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
                                                        NISN: {a.nisn} • Telp: {a.phone_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{a.track?.name || '-'}</div>
                                                    <div className="text-[11px] text-slate-400">{a.department?.name || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleReRegistration(a)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                                                            a.re_registration_status === 're_registered'
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        {a.re_registration_status === 're_registered' ? (
                                                            <>
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                <span>Sudah Daftar Ulang</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span>Belum Daftar Ulang</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {a.converted_to_student_id ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold font-mono">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>Siswa Aktif (NIS: {a.converted_to_student?.nis || a.converted_to_student_id})</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px]">Belum Dikonversi</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {a.converted_to_student_id ? (
                                                        <Link
                                                            href={route('academic.students.index', { search: a.nisn })}
                                                            className="text-xs font-semibold text-blue-600 hover:underline"
                                                        >
                                                            Lihat di Master Data
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleConvert(a)}
                                                            disabled={convertingId === a.id}
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
                                                        >
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            <span>{convertingId === a.id ? 'Mengonversi...' : 'Konversi ke Siswa'}</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                                Belum ada calon siswa yang berstatus diterima / lolos seleksi.
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

