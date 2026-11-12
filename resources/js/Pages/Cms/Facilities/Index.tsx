import ImageUpload from '@/Components/ImageUpload';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, CheckCircle, Edit3, Plus, Trash2, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface FacilityItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    order: number;
    is_active: boolean;
}

interface FacilitiesCmsProps {
    facilities: {
        data: FacilityItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function FacilitiesCmsIndex({ facilities }: FacilitiesCmsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        description: string;
        image_path: string;
        image_file: File | null;
        order: number;
        is_active: boolean;
        _method?: string;
    }>({
        name: '',
        description: '',
        image_path: '',
        image_file: null,
        order: 0,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingFacility(null);
        reset();
        clearErrors();
        setData({
            name: '',
            description: '',
            image_path: '',
            image_file: null,
            order: (facilities.data.length + 1) * 10,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (f: FacilityItem) => {
        setEditingFacility(f);
        clearErrors();
        setData({
            name: f.name,
            description: f.description || '',
            image_path: f.image_path || '',
            image_file: null,
            order: f.order,
            is_active: f.is_active,
        });
        setIsModalOpen(true);
    };

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingFacility) {
            router.post(
                route('cms.facilities.update', editingFacility.id),
                {
                    _method: 'put',
                    ...data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => setIsModalOpen(false),
                }
            );
        } else {
            router.post(route('cms.facilities.store'), data, {
                forceFormData: true,
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (f: FacilityItem) => {
        if (confirm(`Hapus fasilitas "${f.name}"?`)) {
            router.delete(route('cms.facilities.destroy', f.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Manajemen Fasilitas Sekolah (CMS)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola sarana prasarana yang ditampilkan pada profil publik kampus.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Fasilitas</span>
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Fasilitas" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Fasilitas</th>
                                        <th className="px-6 py-3.5">Deskripsi</th>
                                        <th className="px-6 py-3.5">Urutan</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {facilities.data.length > 0 ? (
                                        facilities.data.map((f) => (
                                            <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                            {f.image_path ? (
                                                                <img
                                                                    src={f.image_path}
                                                                    alt={f.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <Building2 className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">
                                                                {f.name}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 font-normal">
                                                                /{f.slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {f.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500">
                                                    {f.order}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {f.is_active ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                                                            <XCircle className="w-3 h-3" />
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(f)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Edit Fasilitas"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(f)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                            title="Hapus Fasilitas"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                Belum ada fasilitas yang ditambahkan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <form onSubmit={submitForm} className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        {editingFacility ? 'Edit Fasilitas Sekolah' : 'Tambah Fasilitas Baru'}
                    </h3>

                    <div className="space-y-3 text-xs">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Fasilitas *" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                className="mt-1 block w-full text-xs"
                                placeholder="Contoh: Laboratorium Komputer RPL & TKJ"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <ImageUpload
                                label="Foto Fasilitas"
                                value={data.image_path}
                                onChangeFile={(f) => setData('image_file', f)}
                                onClear={() => {
                                    setData('image_file', null);
                                    setData('image_path', '');
                                }}
                                aspectRatio="video"
                                maxSizeMB={5}
                                hint="Unggah foto dokumentasi sarana atau fasilitas kampus (Maks. 5MB, format JPG/PNG/WebP)."
                                error={errors.image_path || (errors as any).image_file}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Deskripsi Fasilitas" />
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                placeholder="Rincian perlengkapan dan kapasitas..."
                            />
                            <InputError message={errors.description} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="order" value="Urutan Tampil" />
                                <TextInput
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    className="mt-1 block w-full text-xs"
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                />
                                <InputError message={errors.order} className="mt-1" />
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 text-xs"
                                    />
                                    <span className="text-xs text-slate-700 font-medium">
                                        Tampilkan di Website
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="text-xs">
                            {editingFacility ? 'Simpan Perubahan' : 'Tambahkan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

