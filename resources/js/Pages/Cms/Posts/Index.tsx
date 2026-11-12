import ImageUpload from '@/Components/ImageUpload';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Edit3,
    FileText,
    Filter,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface PostItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    status: string;
    published_at: string | null;
    event_date: string | null;
    author?: { name: string };
}

interface PostsCmsProps {
    posts: {
        data: PostItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        category?: string;
        status?: string;
        search?: string;
    };
}

export default function PostsCmsIndex({ posts, filters }: PostsCmsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostItem | null>(null);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: 'news',
        content: '',
        excerpt: '',
        featured_image: '',
        image_file: null as File | null,
        status: 'published',
        published_at: '',
        event_date: '',
    });

    const categoryBadges: Record<string, { label: string; bg: string; text: string }> = {
        news: { label: 'Berita', bg: 'bg-blue-50', text: 'text-blue-700' },
        announcement: { label: 'Pengumuman', bg: 'bg-amber-50', text: 'text-amber-700' },
        achievement: { label: 'Prestasi', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        agenda: { label: 'Agenda', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    };

    const handleFilter = (cat = selectedCategory, stat = selectedStatus, q = searchTerm) => {
        router.get(
            route('cms.posts.index'),
            {
                category: cat || undefined,
                status: stat || undefined,
                search: q || undefined,
            },
            { preserveState: true }
        );
    };

    const openCreateModal = () => {
        setEditingPost(null);
        reset();
        clearErrors();
        setData({
            title: '',
            category: 'news',
            content: '',
            excerpt: '',
            featured_image: '',
            image_file: null,
            status: 'published',
            published_at: new Date().toISOString().slice(0, 16),
            event_date: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (p: PostItem) => {
        setEditingPost(p);
        clearErrors();
        setData({
            title: p.title,
            category: p.category,
            content: p.content,
            excerpt: p.excerpt || '',
            featured_image: p.featured_image || '',
            image_file: null,
            status: p.status,
            published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : '',
            event_date: p.event_date ? new Date(p.event_date).toISOString().slice(0, 16) : '',
        });
        setIsModalOpen(true);
    };

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingPost) {
            router.post(
                route('cms.posts.update', editingPost.id),
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
            router.post(
                route('cms.posts.store'),
                data,
                {
                    forceFormData: true,
                    onSuccess: () => setIsModalOpen(false),
                }
            );
        }
    };

    const handleDelete = (p: PostItem) => {
        if (confirm(`Hapus konten "${p.title}"?`)) {
            router.delete(route('cms.posts.destroy', p.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Manajemen Berita & Informasi (CMS)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola publikasi artikel berita, pengumuman resmi, prestasi, dan agenda kegiatan sekolah.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tulis Konten Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Berita & Informasi" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Toolbar / Filters */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    handleFilter(e.target.value, selectedStatus, searchTerm);
                                }}
                                className="text-xs rounded-xl border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                            >
                                <option value="">Semua Kategori</option>
                                <option value="news">Berita</option>
                                <option value="announcement">Pengumuman</option>
                                <option value="achievement">Prestasi</option>
                                <option value="agenda">Agenda</option>
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleFilter(selectedCategory, e.target.value, searchTerm);
                                }}
                                className="text-xs rounded-xl border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Terbit (Published)</option>
                                <option value="draft">Konsep (Draft)</option>
                            </select>
                        </div>

                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleFilter(selectedCategory, selectedStatus, searchTerm);
                                    }
                                }}
                                placeholder="Cari judul konten..."
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Judul Konten</th>
                                        <th className="px-6 py-3.5">Kategori</th>
                                        <th className="px-6 py-3.5">Penulis</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5">Tanggal Terbit</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {posts.data.length > 0 ? (
                                        posts.data.map((p) => {
                                            const badge = categoryBadges[p.category] || {
                                                label: p.category,
                                                bg: 'bg-slate-100',
                                                text: 'text-slate-700',
                                            };

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900 max-w-sm">
                                                            {p.title}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-normal">
                                                            /{p.slug}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {p.author?.name || 'Admin'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {p.status === 'published' ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Terbit
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                                                                Konsep
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {p.published_at
                                                            ? new Date(p.published_at).toLocaleDateString('id-ID', {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                              })
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(p)}
                                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                                title="Edit Konten"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p)}
                                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                                title="Hapus Konten"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                                Tidak ada konten berita yang ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form Tambah/Edit */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submitForm} className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        {editingPost ? 'Edit Konten Publikasi' : 'Tulis Konten Baru'}
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Konten *" />
                            <TextInput
                                id="title"
                                type="text"
                                value={data.title}
                                className="mt-1 block w-full text-xs"
                                placeholder="Contoh: Siswa Eduvia Raih Medali Emas Lomba Vokasi Nasional"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="category" value="Kategori Konten *" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                >
                                    <option value="news">Berita</option>
                                    <option value="announcement">Pengumuman</option>
                                    <option value="achievement">Prestasi</option>
                                    <option value="agenda">Agenda Kegiatan</option>
                                </select>
                                <InputError message={errors.category} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status Publikasi *" />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                >
                                    <option value="published">Terbitkan Langsung (Published)</option>
                                    <option value="draft">Simpan Sebagai Konsep (Draft)</option>
                                </select>
                                <InputError message={errors.status} className="mt-1" />
                            </div>
                        </div>

                        {data.category === 'agenda' && (
                            <div>
                                <InputLabel htmlFor="event_date" value="Tanggal & Waktu Kegiatan (Agenda)" />
                                <TextInput
                                    id="event_date"
                                    type="datetime-local"
                                    value={data.event_date}
                                    className="mt-1 block w-full text-xs"
                                    onChange={(e) => setData('event_date', e.target.value)}
                                />
                                <InputError message={errors.event_date} className="mt-1" />
                            </div>
                        )}

                        <div>
                            <ImageUpload
                                label="Gambar Sampul / Banner Konten"
                                value={data.featured_image}
                                onChangeFile={(file) => setData('image_file', file)}
                                aspectRatio="video"
                                maxSizeMB={5}
                                error={errors.featured_image || (errors as any).image_file}
                                helperText="Foto landscape beresolusi tinggi (rasio 16:9)."
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="excerpt" value="Ringkasan Singkat (Excerpt)" />
                            <textarea
                                id="excerpt"
                                rows={2}
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                placeholder="Tuliskan 1-2 kalimat pengantar..."
                            />
                            <InputError message={errors.excerpt} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Isi Artikel Lengkap *" />
                            <textarea
                                id="content"
                                rows={8}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                placeholder="Tuliskan isi berita atau pengumuman secara rinci..."
                                required
                            />
                            <InputError message={errors.content} className="mt-1" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="text-xs">
                            {editingPost ? 'Simpan Perubahan' : 'Terbitkan Konten'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

