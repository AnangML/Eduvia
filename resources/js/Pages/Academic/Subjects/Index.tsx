import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Subject {
    id: number;
    code: string;
    name: string;
    group: string;
    kkm_score: number;
    is_active: boolean;
}

export default function SubjectsIndex({
    subjects,
    filters,
}: {
    subjects: Subject[];
    filters: { search?: string };
}) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        group: 'Umum',
        kkm_score: 75,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('academic.subjects.index'), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingSubject(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (s: Subject) => {
        setEditingSubject(s);
        setData({
            code: s.code,
            name: s.name,
            group: s.group,
            kkm_score: s.kkm_score,
        });
        setShowModal(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingSubject) {
            put(route('academic.subjects.update', editingSubject.id), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('academic.subjects.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (s: Subject) => {
        if (confirm(`Nonaktifkan mata pelajaran ${s.name}?`)) {
            router.delete(route('academic.subjects.destroy', s.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Mata Pelajaran
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola kurikulum mata pelajaran umum, kejuruan, dan muatan lokal
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Mata Pelajaran
                    </button>
                </div>
            }
        >
            <Head title="Mata Pelajaran" />

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

            {/* Search Bar */}
            <div className="mb-6 flex items-center justify-between">
                <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Cari kode atau nama mapel..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border-slate-300 pl-9 pr-4 py-2 text-xs focus:border-brand-600 focus:ring-brand-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </form>

                <div className="text-xs text-slate-500">
                    Total: <strong className="text-slate-800">{subjects.length}</strong> mapel
                </div>
            </div>

            {/* Subjects Table Card */}
            <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3.5">Kode</th>
                                <th className="px-6 py-3.5">Nama Mata Pelajaran</th>
                                <th className="px-6 py-3.5">Kelompok Kurikulum</th>
                                <th className="px-6 py-3.5">Kriteria KKM</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {subjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        Belum ada mata pelajaran terdaftar.
                                    </td>
                                </tr>
                            ) : (
                                subjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                            {subject.code}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {subject.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block rounded px-2.5 py-0.5 text-[10px] font-bold border ${
                                                    subject.group === 'Kejuruan'
                                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                        : subject.group === 'Muatan Lokal'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                {subject.group}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {subject.kkm_score} / 100
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(subject)}
                                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subject)}
                                                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah / Edit Mapel */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900">
                            {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                        </h3>

                        <form onSubmit={submit} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700">Kode Mapel (Unik)</label>
                                <input
                                    type="text"
                                    placeholder="contoh: PWEB-X atau BIN-X"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500 uppercase"
                                    required
                                />
                                {errors.code && <p className="mt-1 text-xs text-rose-600">{errors.code}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Nama Mata Pelajaran</label>
                                <input
                                    type="text"
                                    placeholder="contoh: Pemrograman Web & Perangkat Bergerak"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Kelompok</label>
                                    <select
                                        value={data.group}
                                        onChange={(e) => setData('group', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    >
                                        <option value="Umum">Umum (Nasional)</option>
                                        <option value="Kejuruan">Kejuruan</option>
                                        <option value="Muatan Lokal">Muatan Lokal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Batas KKM (0–100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.kkm_score}
                                        onChange={(e) => setData('kkm_score', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                        required
                                    />
                                </div>
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
                                    {editingSubject ? 'Simpan Perubahan' : 'Tambah Mapel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

