import ImageUpload from '@/Components/ImageUpload';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    FileSpreadsheet,
    Globe,
    Key,
    Pencil,
    Plus,
    Search,
    Trash2,
    Upload,
    UserCheck,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Teacher {
    id: number;
    nip: string | null;
    nuptk: string | null;
    name: string;
    gender: string;
    phone_number: string | null;
    employment_status: string;
    is_public?: boolean;
    photo?: string | null;
    title_degree?: string | null;
    user?: {
        id: number;
        username: string;
    } | null;
    current_homeroom_classroom?: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedTeachers {
    data: Teacher[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

export default function TeachersIndex({
    teachers,
    filters,
}: {
    teachers: PaginatedTeachers;
    filters: { search?: string };
}) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        nip: string;
        nuptk: string;
        gender: string;
        phone_number: string;
        employment_status: string;
        address: string;
        create_user: boolean;
        photo: string;
        photo_file: File | null;
        _method?: string;
    }>({
        name: '',
        nip: '',
        nuptk: '',
        gender: 'L',
        phone_number: '',
        employment_status: 'PNS',
        address: '',
        create_user: true,
        photo: '',
        photo_file: null,
    });

    const importForm = useForm<{ file: File | null }>({
        file: null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('academic.teachers.index'), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingTeacher(null);
        reset();
        setData({
            name: '',
            nip: '',
            nuptk: '',
            gender: 'L',
            phone_number: '',
            employment_status: 'PNS',
            address: '',
            create_user: true,
            photo: '',
            photo_file: null,
        });
        setShowModal(true);
    };

    const openEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setData({
            name: teacher.name,
            nip: teacher.nip || '',
            nuptk: teacher.nuptk || '',
            gender: teacher.gender,
            phone_number: teacher.phone_number || '',
            employment_status: teacher.employment_status,
            address: '',
            create_user: false,
            photo: teacher.photo || '',
            photo_file: null,
        });
        setShowModal(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingTeacher) {
            router.post(
                route('academic.teachers.update', editingTeacher.id),
                {
                    _method: 'put',
                    ...data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setShowModal(false);
                        reset();
                    },
                }
            );
        } else {
            router.post(route('academic.teachers.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (teacher: Teacher) => {
        if (confirm(`Nonaktifkan data guru ${teacher.name}?`)) {
            router.delete(route('academic.teachers.destroy', teacher.id));
        }
    };

    const handleGenerateUser = (teacherId: number) => {
        router.post(route('academic.teachers.generate-user', teacherId));
    };

    const handleTogglePublic = (teacherId: number) => {
        router.post(route('academic.teachers.toggle-public', teacherId), {}, { preserveScroll: true });
    };

    const handleImportSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        importForm.post(route('academic.teachers.import'), {
            onSuccess: () => {
                setShowImportModal(false);
                importForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Data Guru & Tenaga Pendidik
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola data pengajar, wali kelas, serta akun login sistem
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                        >
                            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                            Impor Excel
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Guru
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Data Guru" />

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

            {/* Filter & Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Cari nama guru atau NIP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border-slate-300 pl-9 pr-4 py-2 text-xs focus:border-brand-600 focus:ring-brand-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </form>

                <div className="text-xs text-slate-500">
                    Total: <strong className="text-slate-800">{teachers.total}</strong> guru terdata
                </div>
            </div>

            {/* Teachers Table Card */}
            <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3.5">Nama & Gelar</th>
                                <th className="px-6 py-3.5">NIP / NUPTK</th>
                                <th className="px-6 py-3.5">Status & Kontak</th>
                                <th className="px-6 py-3.5">Tugas Wali Kelas</th>
                                <th className="px-6 py-3.5">Akun Login</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {teachers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        Belum ada data guru. Silakan tambah data baru atau impor dari Excel.
                                    </td>
                                </tr>
                            ) : (
                                teachers.data.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                    {teacher.photo ? (
                                                        <img
                                                            src={teacher.photo}
                                                            alt={teacher.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div>{teacher.name}</div>
                                                    <div className="text-[11px] font-normal text-slate-400">
                                                        Jenis Kelamin: {teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                                            <div>NIP: {teacher.nip || '-'}</div>
                                            <div className="text-slate-400">NUPTK: {teacher.nuptk || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block rounded px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                {teacher.employment_status}
                                            </span>
                                            <div className="text-[11px] text-slate-500 mt-1">
                                                {teacher.phone_number || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {teacher.current_homeroom_classroom ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                                                    Wali Kelas {teacher.current_homeroom_classroom.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">Bukan Wali Kelas</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {teacher.user ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {teacher.user.username}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleGenerateUser(teacher.id)}
                                                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold text-[11px] underline"
                                                >
                                                    <Key className="h-3 w-3" />
                                                    Buat Akun
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleTogglePublic(teacher.id)}
                                                    className={`rounded-lg p-1.5 transition-colors ${
                                                        teacher.is_public
                                                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                                    }`}
                                                    title={teacher.is_public ? 'Ditampilkan di Web Publik' : 'Disembunyikan dari Web Publik'}
                                                >
                                                    <Globe className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(teacher)}
                                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher)}
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

                {/* Pagination */}
                {teachers.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 bg-slate-50/50">
                        <div className="flex gap-1">
                            {teachers.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-brand-600 text-white font-bold'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            : 'text-slate-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah / Edit Guru */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in">
                        <h3 className="text-lg font-bold text-slate-900">
                            {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                        </h3>

                        <form onSubmit={submit} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700">Nama Lengkap & Gelar</label>
                                <input
                                    type="text"
                                    placeholder="contoh: Drs. Hendra Gunawan, M.Pd."
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">NIP (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="18 digit NIP"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    />
                                    {errors.nip && <p className="mt-1 text-xs text-rose-600">{errors.nip}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">NUPTK (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="16 digit NUPTK"
                                        value={data.nuptk}
                                        onChange={(e) => setData('nuptk', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Jenis Kelamin</label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    >
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">Status Kepegawaian</label>
                                    <select
                                        value={data.employment_status}
                                        onChange={(e) => setData('employment_status', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                    >
                                        <option value="PNS">PNS</option>
                                        <option value="PPPK">PPPK</option>
                                        <option value="Honorer">Honorer</option>
                                        <option value="GTY">GTY (Yayasan)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700">Nomor Telepon / WhatsApp</label>
                                <input
                                    type="text"
                                    placeholder="081234567890"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-xs focus:border-brand-600 focus:ring-brand-500"
                                />
                            </div>

                            <div>
                                <ImageUpload
                                    label="Foto Profil Guru / Pendidik"
                                    value={data.photo}
                                    onChangeFile={(f) => setData('photo_file', f)}
                                    onClear={() => {
                                        setData('photo_file', null);
                                        setData('photo', '');
                                    }}
                                    aspectRatio="square"
                                    maxSizeMB={5}
                                    hint="Unggah pas foto formal / profil guru (Maks. 5MB, format JPG/PNG/WebP)."
                                    error={errors.photo || (errors as any).photo_file}
                                />
                            </div>

                            {!editingTeacher && (
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <input
                                        type="checkbox"
                                        checked={data.create_user}
                                        onChange={(e) => setData('create_user', e.target.checked)}
                                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    <span className="text-xs font-medium text-slate-700">
                                        Sekaligus buatkan akun login (password default: NIP / GuruEduvia#2026)
                                    </span>
                                </label>
                            )}

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
                                    {editingTeacher ? 'Simpan Perubahan' : 'Tambah Guru'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Impor Excel */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900">
                            Impor Data Guru dari Excel
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Unggah berkas spreadsheet (.xlsx, .xls, .csv). Kolom yang dibutuhkan: <strong>nama, nip, nuptk, jenis_kelamin, status_kepegawaian, no_telepon</strong>.
                        </p>

                        <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
                            <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-brand-500 transition">
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => importForm.setData('file', e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowImportModal(false)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={importForm.processing || !importForm.data.file}
                                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                                >
                                    Mulai Impor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

