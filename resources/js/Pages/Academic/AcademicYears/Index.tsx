import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Plus,
    School,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Semester {
    id: number;
    semester_number: number;
    name: string;
    is_active: boolean;
}

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    semesters: Semester[];
}

interface GradeLevel {
    id: number;
    level_number: number;
    name: string;
    educational_level: string;
}

interface Department {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
}

export default function AcademicYearsIndex({
    academicYears,
    gradeLevels,
    departments,
}: {
    academicYears: AcademicYear[];
    gradeLevels: GradeLevel[];
    departments: Department[];
}) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        is_active: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('academic.years.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleSetActive = (yearId: number, semesterId?: number) => {
        if (confirm('Aktifkan tahun ajaran dan semester ini sebagai acuan aktif sistem?')) {
            router.post(route('academic.years.set-active', yearId), semesterId ? { semester_id: semesterId } : {});
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Tahun Ajaran & Semester
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola periode akademik aktif dan struktur tingkatan sekolah
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Tahun Ajaran
                    </button>
                </div>
            }
        >
            <Head title="Tahun Ajaran & Semester" />

            {/* Flash Alerts */}
            {flash?.success && (
                <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Academic Years List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Daftar Tahun Ajaran
                    </h2>

                    <div className="space-y-3">
                        {academicYears.map((year) => (
                            <div
                                key={year.id}
                                className={`rounded-2xl bg-white border p-6 shadow-sm transition-all ${
                                    year.is_active
                                        ? 'border-brand-300 ring-1 ring-brand-200'
                                        : 'border-slate-200/80 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`rounded-xl p-3 ${
                                                year.is_active
                                                    ? 'bg-brand-50 text-brand-600 border border-brand-200'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {year.name}
                                                </h3>
                                                {year.is_active && (
                                                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                                        Aktif
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {year.start_date} s/d {year.end_date}
                                            </p>
                                        </div>
                                    </div>

                                    {!year.is_active && (
                                        <button
                                            onClick={() => handleSetActive(year.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                            Jadikan Aktif
                                        </button>
                                    )}
                                </div>

                                {/* Semesters in this Academic Year */}
                                <div className="mt-4">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                        Semester
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {year.semesters.map((sem) => (
                                            <div
                                                key={sem.id}
                                                className={`flex items-center justify-between rounded-xl p-3 border text-xs font-medium ${
                                                    sem.is_active && year.is_active
                                                        ? 'bg-brand-50/70 border-brand-200 text-brand-800'
                                                        : 'bg-slate-50 border-slate-200/70 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-400" />
                                                    <span>Semester {sem.name} (Semester {sem.semester_number})</span>
                                                </div>
                                                {sem.is_active && year.is_active ? (
                                                    <span className="font-semibold text-brand-700">Sedang Berjalan</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSetActive(year.id, sem.id)}
                                                        className="text-[11px] text-slate-500 hover:text-brand-600 underline"
                                                    >
                                                        Aktifkan
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Structure Reference Sidebar */}
                <div className="space-y-6">
                    {/* Grade Levels */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                            Tingkatan Kelas ({gradeLevels[0]?.educational_level || 'SMA/SMK'})
                        </h3>
                        <div className="mt-3 space-y-2">
                            {gradeLevels.map((gl) => (
                                <div
                                    key={gl.id}
                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm border border-slate-200/60"
                                >
                                    <span className="font-medium text-slate-800">{gl.name}</span>
                                    <span className="rounded bg-white px-2 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                                        Tingkat {gl.level_number}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Departments */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                            Jurusan / Peminatan Aktif
                        </h3>
                        <div className="mt-3 space-y-2">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm border border-slate-200/60"
                                >
                                    <div className="min-w-0 pr-2">
                                        <div className="font-semibold text-slate-800 truncate">{dept.name}</div>
                                        <div className="text-[11px] text-slate-500">Kode: {dept.code}</div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                        Aktif
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Tahun Ajaran */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900">
                            Tambah Tahun Ajaran Baru
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Sistem otomatis membuat Semester Ganjil & Genap.
                        </p>

                        <form onSubmit={submit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700">
                                    Nama Tahun Ajaran
                                </label>
                                <input
                                    type="text"
                                    placeholder="contoh: 2027/2028"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-brand-600 focus:ring-brand-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-brand-600 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.start_date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-brand-600 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.end_date && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                />
                                <span className="text-xs font-medium text-slate-700">
                                    Langsung aktifkan tahun ajaran ini
                                </span>
                            </label>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                                >
                                    Simpan Tahun Ajaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

