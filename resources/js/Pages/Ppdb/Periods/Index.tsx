import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Edit3,
    Layers,
    Plus,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface PpdbTrack {
    id: number;
    name: string;
    code: string;
    quota: number;
}

interface PeriodItem {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    announcement_date: string | null;
    re_registration_start: string | null;
    re_registration_end: string | null;
    is_active: boolean;
    description: string | null;
    applicants_count: number;
    academic_year?: { name: string };
    tracks: PpdbTrack[];
}

interface PeriodsProps {
    periods: {
        data: PeriodItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
}

export default function PeriodsIndex({ periods, academicYears }: PeriodsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<PeriodItem | null>(null);

    const activeAcademicYear = academicYears.find((y) => y.is_active) || academicYears[0];

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        academic_year_id: activeAcademicYear?.id || '',
        name: '',
        start_date: '',
        end_date: '',
        announcement_date: '',
        re_registration_start: '',
        re_registration_end: '',
        is_active: true,
        description: '',
        tracks: [
            { name: 'Jalur Reguler / Zonasi', code: 'REGULER', quota: 60 },
            { name: 'Jalur Prestasi', code: 'PRESTASI', quota: 30 },
            { name: 'Jalur Afirmasi', code: 'AFIRMASI', quota: 20 },
            { name: 'Jalur Mutasi', code: 'MUTASI', quota: 10 },
        ],
    });

    const openCreateModal = () => {
        setEditingPeriod(null);
        reset();
        clearErrors();
        setData({
            academic_year_id: activeAcademicYear?.id || '',
            name: `PPDB Gelombang ${(periods.data.length + 1)} TP ${activeAcademicYear?.name || '2026/2027'}`,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            announcement_date: new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0],
            re_registration_start: new Date(Date.now() + 36 * 86400000).toISOString().split('T')[0],
            re_registration_end: new Date(Date.now() + 42 * 86400000).toISOString().split('T')[0],
            is_active: true,
            description: '',
            tracks: [
                { name: 'Jalur Reguler / Zonasi', code: 'REGULER', quota: 60 },
                { name: 'Jalur Prestasi', code: 'PRESTASI', quota: 30 },
                { name: 'Jalur Afirmasi', code: 'AFIRMASI', quota: 20 },
                { name: 'Jalur Mutasi', code: 'MUTASI', quota: 10 },
            ],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (p: PeriodItem) => {
        setEditingPeriod(p);
        clearErrors();
        setData({
            academic_year_id: '',
            name: p.name,
            start_date: p.start_date,
            end_date: p.end_date,
            announcement_date: p.announcement_date || '',
            re_registration_start: p.re_registration_start || '',
            re_registration_end: p.re_registration_end || '',
            is_active: p.is_active,
            description: p.description || '',
            tracks: [],
        });
        setIsModalOpen(true);
    };

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingPeriod) {
            put(route('ppdb.periods.update', editingPeriod.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('ppdb.periods.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const toggleActive = (p: PeriodItem) => {
        router.post(route('ppdb.periods.toggle-active', p.id));
    };

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
                            Manajemen Gelombang & Periode PPDB
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Atur jadwal pembukaan pendaftaran, jalur penerimaan, dan daya tampung kuota.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buat Gelombang Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Gelombang & Periode PPDB" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Nama Gelombang</th>
                                        <th className="px-6 py-3.5">Periode Pendaftaran</th>
                                        <th className="px-6 py-3.5">Pengumuman & Daftar Ulang</th>
                                        <th className="px-6 py-3.5">Pendaftar</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {periods.data.length > 0 ? (
                                        periods.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{p.name}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                                        Tahun Ajaran: {p.academic_year?.name || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">
                                                        {formatDate(p.start_date)} - {formatDate(p.end_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>Pengumuman: {formatDate(p.announcement_date)}</div>
                                                    <div className="text-[11px] text-slate-400">
                                                        Daftar Ulang: {formatDate(p.re_registration_start)} - {formatDate(p.re_registration_end)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold font-mono text-blue-600 text-sm">
                                                        {p.applicants_count}
                                                    </span>
                                                    <span className="text-slate-400 text-[11px] block">calon siswa</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleActive(p)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                                                            p.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {p.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        <span>{p.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Edit Periode"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                                Belum ada gelombang pendaftaran PPDB.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create / Edit Period */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submitForm} className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        {editingPeriod ? 'Edit Gelombang PPDB' : 'Buat Gelombang PPDB Baru'}
                    </h3>

                    <div className="space-y-4 text-xs">
                        {!editingPeriod && (
                            <div>
                                <InputLabel htmlFor="academic_year_id" value="Tahun Ajaran *" />
                                <select
                                    id="academic_year_id"
                                    value={data.academic_year_id}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    required
                                >
                                    {academicYears.map((y) => (
                                        <option key={y.id} value={y.id}>
                                            {y.name} {y.is_active && '(Aktif)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="name" value="Nama Gelombang / Periode *" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full text-xs"
                                placeholder="PPDB Gelombang 1 TP 2026/2027"
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="start_date" value="Tanggal Buka Pendaftaran *" />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                    required
                                />
                                <InputError message={errors.start_date} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="end_date" value="Tanggal Tutup Pendaftaran *" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                    required
                                />
                                <InputError message={errors.end_date} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="announcement_date" value="Tanggal Pengumuman" />
                                <TextInput
                                    id="announcement_date"
                                    type="date"
                                    value={data.announcement_date}
                                    onChange={(e) => setData('announcement_date', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="re_registration_start" value="Mulai Daftar Ulang" />
                                <TextInput
                                    id="re_registration_start"
                                    type="date"
                                    value={data.re_registration_start}
                                    onChange={(e) => setData('re_registration_start', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="re_registration_end" value="Selesai Daftar Ulang" />
                                <TextInput
                                    id="re_registration_end"
                                    type="date"
                                    value={data.re_registration_end}
                                    onChange={(e) => setData('re_registration_end', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                />
                            </div>
                        </div>

                        {!editingPeriod && (
                            <div className="pt-2 border-t border-slate-100 space-y-3">
                                <h4 className="font-bold text-slate-900">Jalur Penerimaan & Kuota</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {data.tracks.map((t, idx) => (
                                        <div key={t.code} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                                            <span className="font-bold text-slate-800">{t.name}</span>
                                            <div>
                                                <label className="text-[11px] text-slate-500">Kuota Siswa:</label>
                                                <input
                                                    type="number"
                                                    value={t.quota}
                                                    onChange={(e) => {
                                                        const newTracks = [...data.tracks];
                                                        newTracks[idx].quota = parseInt(e.target.value) || 0;
                                                        setData('tracks', newTracks);
                                                    }}
                                                    className="w-full rounded-lg border-slate-300 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="text-xs">
                            {editingPeriod ? 'Simpan Perubahan' : 'Buat Gelombang'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

