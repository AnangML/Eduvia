import ImageUpload from '@/Components/ImageUpload';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Camera, Edit3, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface GalleryPhoto {
    id: number;
    title: string | null;
    image_path: string;
    caption: string | null;
    order: number;
}

interface GalleryAlbumItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    order: number;
    is_active: boolean;
    galleries: GalleryPhoto[];
}

interface GalleriesCmsProps {
    albums: {
        data: GalleryAlbumItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function GalleriesCmsIndex({ albums }: GalleriesCmsProps) {
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<GalleryAlbumItem | null>(null);

    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [targetAlbum, setTargetAlbum] = useState<GalleryAlbumItem | null>(null);

    const albumForm = useForm<{
        title: string;
        description: string;
        cover_image: string;
        cover_file: File | null;
        order: number;
        is_active: boolean;
        _method?: string;
    }>({
        title: '',
        description: '',
        cover_image: '',
        cover_file: null,
        order: 0,
        is_active: true,
    });

    const photoForm = useForm<{
        title: string;
        image_path: string;
        image_file: File | null;
        caption: string;
        order: number;
    }>({
        title: '',
        image_path: '',
        image_file: null,
        caption: '',
        order: 0,
    });

    const openCreateAlbum = () => {
        setEditingAlbum(null);
        albumForm.reset();
        albumForm.clearErrors();
        albumForm.setData({
            title: '',
            description: '',
            cover_image: '',
            cover_file: null,
            order: (albums.data.length + 1) * 10,
            is_active: true,
        });
        setIsAlbumModalOpen(true);
    };

    const openEditAlbum = (album: GalleryAlbumItem) => {
        setEditingAlbum(album);
        albumForm.clearErrors();
        albumForm.setData({
            title: album.title,
            description: album.description || '',
            cover_image: album.cover_image || '',
            cover_file: null,
            order: album.order,
            is_active: album.is_active,
        });
        setIsAlbumModalOpen(true);
    };

    const submitAlbum: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingAlbum) {
            router.post(
                route('cms.galleries.update', editingAlbum.id),
                {
                    _method: 'put',
                    ...albumForm.data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => setIsAlbumModalOpen(false),
                }
            );
        } else {
            router.post(route('cms.galleries.store'), albumForm.data, {
                forceFormData: true,
                onSuccess: () => setIsAlbumModalOpen(false),
            });
        }
    };

    const handleDeleteAlbum = (album: GalleryAlbumItem) => {
        if (confirm(`Hapus album "${album.title}" beserta seluruh fotonya?`)) {
            router.delete(route('cms.galleries.destroy', album.id));
        }
    };

    const openAddPhoto = (album: GalleryAlbumItem) => {
        setTargetAlbum(album);
        photoForm.reset();
        photoForm.clearErrors();
        setIsPhotoModalOpen(true);
    };

    const submitAddPhoto: FormEventHandler = (e) => {
        e.preventDefault();
        if (!targetAlbum) return;

        router.post(
            route('cms.galleries.photos.store', targetAlbum.id),
            photoForm.data,
            {
                forceFormData: true,
                onSuccess: () => {
                    setIsPhotoModalOpen(false);
                    photoForm.reset();
                },
            }
        );
    };

    const handleDeletePhoto = (photoId: number) => {
        if (confirm('Hapus foto ini dari album?')) {
            router.delete(route('cms.galleries.photos.destroy', photoId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Manajemen Galeri & Dokumentasi (CMS)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola album foto kegiatan, upacara, praktikum, dan momen berharga sekolah.
                        </p>
                    </div>
                    <button
                        onClick={openCreateAlbum}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buat Album Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Galeri" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {albums.data.length > 0 ? (
                            albums.data.map((album) => (
                                <div
                                    key={album.id}
                                    className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                            {album.cover_image || (album.galleries && album.galleries[0]?.image_path) ? (
                                                <img
                                                    src={album.cover_image || album.galleries[0]?.image_path}
                                                    alt={album.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Camera className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                                            )}
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-sm">
                                                {album.galleries?.length || 0} Foto
                                            </span>
                                        </div>

                                        <div className="p-5 space-y-2">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {album.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">
                                                {album.description || 'Tidak ada keterangan album.'}
                                            </p>
                                        </div>

                                        {album.galleries && album.galleries.length > 0 && (
                                            <div className="px-5 pb-4">
                                                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                                                    Foto Dalam Album ({album.galleries.length})
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {album.galleries.slice(0, 8).map((photo) => (
                                                        <div
                                                            key={photo.id}
                                                            className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                                                        >
                                                            <img
                                                                src={photo.image_path}
                                                                alt={photo.title || 'Foto'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeletePhoto(photo.id)}
                                                                className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                                title="Hapus foto dari album"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-rose-400 hover:text-rose-300" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action footer */}
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <button
                                            onClick={() => openAddPhoto(album)}
                                            className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700"
                                        >
                                            <ImagePlus className="w-4 h-4" />
                                            <span>Tambah Foto</span>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditAlbum(album)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors"
                                                title="Edit Album"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAlbum(album)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors"
                                                title="Hapus Album"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-400">
                                Belum ada album galeri. Klik &quot;Buat Album Baru&quot; untuk menambahkan.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit Album */}
            <Modal show={isAlbumModalOpen} onClose={() => setIsAlbumModalOpen(false)} maxWidth="md">
                <form onSubmit={submitAlbum} className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        {editingAlbum ? 'Edit Album Galeri' : 'Buat Album Galeri Baru'}
                    </h3>

                    <div className="space-y-3 text-xs">
                        <div>
                            <InputLabel htmlFor="album_title" value="Judul Album *" />
                            <TextInput
                                id="album_title"
                                type="text"
                                value={albumForm.data.title}
                                className="mt-1 block w-full text-xs"
                                placeholder="Contoh: Upacara Kemerdekaan RI ke-81"
                                onChange={(e) => albumForm.setData('title', e.target.value)}
                                required
                            />
                            <InputError message={albumForm.errors.title} className="mt-1" />
                        </div>

                        <div>
                            <ImageUpload
                                label="Foto Sampul Album (Cover)"
                                value={albumForm.data.cover_image}
                                onChangeFile={(f) => albumForm.setData('cover_file', f)}
                                onClear={() => {
                                    albumForm.setData('cover_file', null);
                                    albumForm.setData('cover_image', '');
                                }}
                                aspectRatio="video"
                                maxSizeMB={5}
                                hint="Unggah gambar sampul album (Maks. 5MB, format JPG/PNG/WebP)."
                                error={albumForm.errors.cover_image || (albumForm.errors as any).cover_file}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="album_desc" value="Deskripsi Album" />
                            <textarea
                                id="album_desc"
                                rows={3}
                                value={albumForm.data.description}
                                onChange={(e) => albumForm.setData('description', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                placeholder="Keterangan singkat momen yang didokumentasikan..."
                            />
                            <InputError message={albumForm.errors.description} className="mt-1" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={() => setIsAlbumModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={albumForm.processing} className="text-xs">
                            {editingAlbum ? 'Simpan Album' : 'Buat Album'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Add Photo to Album */}
            <Modal show={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} maxWidth="md">
                <form onSubmit={submitAddPhoto} className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        Tambah Foto ke Album: {targetAlbum?.title}
                    </h3>

                    <div className="space-y-3 text-xs">
                        <div>
                            <ImageUpload
                                label="Pilih File Foto"
                                value={photoForm.data.image_path}
                                onChangeFile={(f) => photoForm.setData('image_file', f)}
                                onClear={() => {
                                    photoForm.setData('image_file', null);
                                    photoForm.setData('image_path', '');
                                }}
                                aspectRatio="video"
                                maxSizeMB={5}
                                hint="Unggah foto kegiatan / momen sekolah (Maks. 5MB, format JPG/PNG/WebP)."
                                error={photoForm.errors.image_path || (photoForm.errors as any).image_file}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="photo_title" value="Judul / Keterangan Singkat" />
                            <TextInput
                                id="photo_title"
                                type="text"
                                value={photoForm.data.title}
                                className="mt-1 block w-full text-xs"
                                placeholder="Contoh: Barisan Pasukan Paskibra"
                                onChange={(e) => photoForm.setData('title', e.target.value)}
                            />
                            <InputError message={photoForm.errors.title} className="mt-1" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={() => setIsPhotoModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="text-xs">
                            Tambahkan Foto
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

