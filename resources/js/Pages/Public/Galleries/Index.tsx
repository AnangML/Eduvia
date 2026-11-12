import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

interface GalleryPhoto {
    id: number;
    title: string | null;
    image_path: string;
    caption: string | null;
}

interface GalleryAlbumItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    galleries: GalleryPhoto[];
}

interface GalleriesProps {
    profile: {
        school_name: string;
        school_tagline: string;
    };
    albums: {
        data: GalleryAlbumItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        last_page: number;
    };
}

export default function GalleriesIndex({ profile, albums }: GalleriesProps) {
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbumItem | null>(null);

    return (
        <PublicLayout
            title="Galeri Dokumentasi Foto Kegiatan"
            description={`Dokumentasi foto kegiatan akademik, ekstrakurikuler, dan prestasi di ${profile.school_name}.`}
            profile={{ school_name: profile.school_name, school_tagline: profile.school_tagline }}
        >
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Dokumentasi
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Galeri Kegiatan & Momen Sekolah
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
                        Merekam jejak langkah dan momen berharga civitas akademika {profile.school_name}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {albums.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {albums.data.map((album) => {
                            const photoCount = album.galleries?.length || 0;
                            const cover =
                                album.cover_image ||
                                (album.galleries && album.galleries[0] ? album.galleries[0].image_path : null);

                            return (
                                <div
                                    key={album.id}
                                    onClick={() => setSelectedAlbum(album)}
                                    className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                                >
                                    <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                        {cover ? (
                                            <img
                                                src={cover}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <Camera className="w-10 h-10 stroke-[1.5]" />
                                                <span className="text-xs mt-1">Album Foto</span>
                                            </div>
                                        )}
                                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            {photoCount} Foto
                                        </span>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {album.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-relaxed">
                                                {album.description || 'Klik untuk membuka koleksi foto dokumentasi kegiatan ini.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-semibold text-blue-600">
                                            Lihat Album Lengkap →
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500">
                        Belum ada album galeri yang dipublikasikan.
                    </div>
                )}

                {/* Pagination */}
                {albums.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1.5 pt-6">
                        {albums.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Album Modal */}
            {selectedAlbum && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    {selectedAlbum.title}
                                </h3>
                                <p className="text-xs text-slate-500 font-normal">
                                    {selectedAlbum.description || 'Koleksi dokumentasi foto'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAlbum(null)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body - Grid of Photos */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {selectedAlbum.galleries && selectedAlbum.galleries.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedAlbum.galleries.map((photo) => (
                                        <div
                                            key={photo.id}
                                            className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col"
                                        >
                                            <div className="h-44 overflow-hidden">
                                                <img
                                                    src={photo.image_path}
                                                    alt={photo.title || selectedAlbum.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            {(photo.title || photo.caption) && (
                                                <div className="p-3 text-xs">
                                                    {photo.title && (
                                                        <div className="font-semibold text-slate-800">
                                                            {photo.title}
                                                        </div>
                                                    )}
                                                    {photo.caption && (
                                                        <div className="text-slate-500 text-[11px] font-normal mt-0.5">
                                                            {photo.caption}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    Belum ada foto dalam album ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

