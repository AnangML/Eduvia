import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    GraduationCap,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface TeachingAssignment {
    id: number;
    teacher_id: number;
    subject_id: number;
    classroom_id: number;
    academic_year_id: number;
    semester_id: number;
    teacher?: { id: number; name: string };
    subject?: { id: number; code: string; name: string };
    classroom?: { id: number; name: string };
}

interface AcademicYear {
    id: number;
    name: string;
    is_active: boolean;
}

interface Semester {
    id: number;
    semester_number: number;
    name: string;
    is_active: boolean;
}

interface Teacher {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    code: string;
    name: string;
}

interface Classroom {
    id: number;
    name: string;
}

export default function TeachingAssignmentsIndex({
    assignments,
    academicYears,
    semesters,
    teachers,
    subjects,
    classrooms,
    selectedYearId,
    selectedSemesterId,
}: {
    assignments: TeachingAssignment[];
    academicYears: AcademicYear[];
    semesters: Semester[];
    teachers: Teacher[];
    subjects: Subject[];
    classrooms: Classroom[];
    selectedYearId: number;
    selectedSemesterId: number;
}) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_id: teachers[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        classroom_id: classrooms[0]?.id || '',
        semester_id: selectedSemesterId,
    });

    const handleFilterChange = (yearId: number, semesterId: number) => {
        router.get(
            route('academic.teaching-assignments.index'),
            { academic_year_id: yearId, semester_id: semesterId },
            { preserveState: true }
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('academic.teaching-assignments.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleDelete = (a: TeachingAssignment) => {
        if (confirm(`Hapus penugasan mengajar ${a.teacher?.name} untuk ${a.subject?.name} di ${a.classroom?.name}?`)) {
            router.delete(route('academic.teaching-assignments.destroy', a.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Plotting Penugasan Mengajar
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Petakan pengajar ke mata pelajaran dan rombongan belajar per semester
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Penugasan
                    </button>
                </div>
            }
        >
            <Head title="Penugasan Mengajar" />

            {/* Flash Alerts */}
            {flash?.success && (
                <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm font-medium text-rose-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Filters Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Tahun:</span>
                    <select
                        value={selectedYearId}
                        onChange={(e) => handleFilterChange(Number(e.target.value), selectedSemesterId)}
                        className="rounded-xl border-slate-300 py-1.5 text-xs focus:border-brand-600 focus:ring-brand-500 font-medium"
                    >
                        {academicYears.map((ay) => (
                            <option key={ay.id} value={ay.id}>{ay.name} {ay.is_active && '(Aktif)'}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Semester:</span>
                    <select
                        value={selectedSemesterId}
                        onChange={(e) => handleFilterChange(selectedYearId, Number(e.target.value))}
                        className="rounded-xl border-slate-300 py-1.5 text-xs focus:border-brand-600 focus:ring-brand-500 font-medium"
                    >
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>Semester {s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="text-xs text-slate-500 ms-auto">
                    Total: <strong className="text-slate-800">{assignments.length}</strong> plotting penugasan
                </div>
            </div>

            {/* Assignments Table Card */}
            <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3.5">Guru Pengajar</th>
                                <th className="px-6 py-3.5">Mata Pelajaran</th>
                                <th className="px-6 py-3.5">Rombel / Kelas</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        Belum ada plotting penugasan mengajar untuk periode semester ini.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            <div className="flex items-center gap-2.5">
                                                <div className="rounded-full bg-brand-50 p-1.5 text-brand-600">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                <span>{assignment.teacher?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            <span className="font-mono text-slate-400 mr-1.5">[{assignment.subject?.code}]</span>
                                            {assignment.subject?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                                                <GraduationCap className="h-3 w-3" />
                                                {assignment.classroom?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(assignment)}
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Penugasan */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900">
                            Tambah Penugasan Mengajar
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Tetapkan guru yang mengajar mata pelajaran di kelas tertentu.
                        </p>

                        <form onSubmit={submit} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700">Pilih Guru Pengajar</label>
                                <select
                                    value={data.teacher_id}
                                    onChange={(e) => setData('teacher_id', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                >
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Pilih Mata Pelajaran</label>
                                <select
                                    value={data.subject_id}
                                    onChange={(e) => setData('subject_id', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                >
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Pilih Rombel / Kelas</label>
                                <select
                                    value={data.classroom_id}
                                    onChange={(e) => setData('classroom_id', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                >
                                    {classrooms.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Semester</label>
                                <select
                                    value={data.semester_id}
                                    onChange={(e) => setData('semester_id', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                >
                                    {semesters.map((s) => (
                                        <option key={s.id} value={s.id}>Semester {s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
                                    Simpan Penugasan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

