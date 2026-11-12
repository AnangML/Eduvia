import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    GraduationCap,
    Pencil,
    Plus,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Classroom {
    id: number;
    name: string;
    capacity: number;
    academic_year_id: number;
    grade_level_id: number;
    department_id: number | null;
    homeroom_teacher_id: number | null;
    grade_level?: { id: number; name: string };
    department?: { id: number; code: string; name: string } | null;
    homeroom_teacher?: { id: number; name: string } | null;
    students_count: number;
}

interface AcademicYear {
    id: number;
    name: string;
    is_active: boolean;
}

interface GradeLevel {
    id: number;
    name: string;
}

interface Department {
    id: number;
    code: string;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
}

export default function ClassroomsIndex({
    classrooms,
    academicYears,
    gradeLevels,
    departments,
    teachers,
    selectedYearId,
}: {
    classrooms: Classroom[];
    academicYears: AcademicYear[];
    gradeLevels: GradeLevel[];
    departments: Department[];
    teachers: Teacher[];
    selectedYearId: number;
}) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        academic_year_id: number;
        grade_level_id: number;
        department_id: number | '';
        homeroom_teacher_id: number | '';
        name: string;
        capacity: number;
    }>({
        academic_year_id: selectedYearId,
        grade_level_id: gradeLevels[0]?.id || 1,
        department_id: departments[0]?.id || '',
        homeroom_teacher_id: '',
        name: '',
        capacity: 36,
    });

    const handleYearChange = (yearId: number) => {
        router.get(route('academic.classrooms.index'), { academic_year_id: yearId }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingClassroom(null);
        reset();
        setData('academic_year_id', selectedYearId);
        setShowModal(true);
    };

    const openEditModal = (c: Classroom) => {
        setEditingClassroom(c);
        setData({
            academic_year_id: c.academic_year_id,
            grade_level_id: c.grade_level_id,
            department_id: c.department_id || '',
            homeroom_teacher_id: c.homeroom_teacher_id || '',
            name: c.name,
            capacity: c.capacity,
        });
        setShowModal(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingClassroom) {
            put(route('academic.classrooms.update', editingClassroom.id), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('academic.classrooms.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (c: Classroom) => {
        if (confirm(`Hapus rombel ${c.name}?`)) {
            router.delete(route('academic.classrooms.destroy', c.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Rombongan Belajar (Rombel / Kelas)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola pembagian kelas, kapasitas siswa, dan penetapan wali kelas
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Rombel
                    </button>
                </div>
            }
        >
            <Head title="Rombongan Belajar" />

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

            {/* Academic Year Selector Pills */}
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Tahun Ajaran:</span>
                {academicYears.map((ay) => (
                    <button
                        key={ay.id}
                        onClick={() => handleYearChange(ay.id)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold shrink-0 transition ${
                            selectedYearId === ay.id
                                ? 'bg-brand-600 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {ay.name} {ay.is_active && '(Aktif)'}
                    </button>
                ))}
            </div>

            {/* Classrooms Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classrooms.length === 0 ? (
                    <div className="col-span-full rounded-2xl bg-white border border-slate-200/80 p-8 text-center text-slate-400">
                        Belum ada kelas/rombel untuk tahun ajaran ini. Klik tombol "Tambah Rombel" untuk memulai.
                    </div>
                ) : (
                    classrooms.map((c) => (
                        <div
                            key={c.id}
                            className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                            {c.name}
                                        </h3>
                                        <div className="text-[11px] font-medium text-slate-500">
                                            {c.grade_level?.name} • {c.department?.name || 'Umum'}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-brand-50 p-2 text-brand-600 border border-brand-100">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Wali Kelas:</span>
                                        <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">
                                            {c.homeroom_teacher?.name || (
                                                <span className="text-rose-500 italic">Belum ditentukan</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Kapasitas Siswa:</span>
                                        <span className="font-bold text-slate-900">
                                            {c.students_count} / {c.capacity} siswa
                                        </span>
                                    </div>

                                    {/* Capacity Progress Bar */}
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                                        <div
                                            className={`h-1.5 rounded-full ${
                                                c.students_count >= c.capacity
                                                    ? 'bg-rose-500'
                                                    : c.students_count > c.capacity * 0.8
                                                    ? 'bg-amber-500'
                                                    : 'bg-emerald-500'
                                            }`}
                                            style={{
                                                width: `${Math.min(100, (c.students_count / c.capacity) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    onClick={() => openEditModal(c)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(c)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Tambah / Edit Rombel */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900">
                            {editingClassroom ? 'Edit Rombel' : 'Tambah Rombongan Belajar'}
                        </h3>

                        <form onSubmit={submit} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700">Nama Kelas / Rombel</label>
                                <input
                                    type="text"
                                    placeholder="contoh: X RPL 1 atau XI MIPA 2"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Tingkat Kelas</label>
                                    <select
                                        value={data.grade_level_id}
                                        onChange={(e) => setData('grade_level_id', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    >
                                        {gradeLevels.map((gl) => (
                                            <option key={gl.id} value={gl.id}>{gl.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Kapasitas Siswa</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Jurusan / Program Keahlian</label>
                                <select
                                    value={data.department_id}
                                    onChange={(e) => setData('department_id', e.target.value ? Number(e.target.value) : '')}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                >
                                    <option value="">-- Umum / Tanpa Jurusan --</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Wali Kelas (1 Guru = Max 1 Rombel)</label>
                                <select
                                    value={data.homeroom_teacher_id}
                                    onChange={(e) => setData('homeroom_teacher_id', e.target.value ? Number(e.target.value) : '')}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                >
                                    <option value="">-- Belum Ditentukan --</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                {errors.homeroom_teacher_id && (
                                    <p className="mt-1 text-xs text-rose-600">{errors.homeroom_teacher_id}</p>
                                )}
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
                                    {editingClassroom ? 'Simpan Perubahan' : 'Buat Rombel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

