import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Search,
    Tag,
} from 'lucide-react';
import { useState } from 'react';

interface PostItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string;
    views_count: number;
    author?: { name: string };
}

interface PostsIndexProps {
    profile: {
        school_name: string;
        school_tagline: string;
    };
    posts: {
        data: PostItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        category?: string;
        search?: string;
    };
    categoryCounts: {
        all: number;
        news: number;
        announcement: number;
        achievement: number;
        agenda: number;
    };
}

export default function PostsIndex({
    profile,
    posts,
    filters,
    categoryCounts,
}: PostsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const categories = [
        { key: '', label: 'Semua Konten', count: categoryCounts.all },
        { key: 'news', label: 'Berita', count: categoryCounts.news },
        { key: 'announcement', label: 'Pengumuman', count: categoryCounts.announcement },
        { key: 'achievement', label: 'Prestasi', count: categoryCounts.achievement },
        { key: 'agenda', label: 'Agenda Kegiatan', count: categoryCounts.agenda },
    ];

    const categoryBadges: Record<string, { label: string; bg: string; text: string }> = {
        news: { label: 'Berita', bg: 'bg-blue-50', text: 'text-blue-700' },
        announcement: { label: 'Pengumuman', bg: 'bg-amber-50', text: 'text-amber-700' },
        achievement: { label: 'Prestasi', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        agenda: { label: 'Agenda', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('public.posts.index'),
            {
                category: filters.category || undefined,
                search: searchTerm || undefined,
            },
            { preserveState: true }
        );
    };

    const handleCategoryClick = (catKey: string) => {
        router.get(
            route('public.posts.index'),
            {
                category: catKey || undefined,
                search: filters.search || undefined,
            },
            { preserveState: true }
        );
    };

    return (
        <PublicLayout
            title="Kabar & Informasi Sekolah"
            description="Kumpulan berita, pengumuman, agenda, dan prestasi siswa terkini."
            profile={{ school_name: profile.school_name, school_tagline: profile.school_tagline }}
        >
            {/* Header Banner */}
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Pusat Informasi
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Kabar, Pengumuman & Agenda
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
                        Informasi resmi kegiatan civitas akademika {profile.school_name}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Filters & Search Toolbar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => {
                            const isSelected = (filters.category || '') === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => handleCategoryClick(cat.key)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                            isSelected
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari artikel..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </form>
                </div>

                {/* Posts Grid */}
                {posts.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.data.map((post) => {
                            const badge = categoryBadges[post.category] || {
                                label: post.category,
                                bg: 'bg-slate-100',
                                text: 'text-slate-700',
                            };

                            return (
                                <article
                                    key={post.id}
                                    className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                                >
                                    <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                        {post.featured_image ? (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <BookOpen className="w-10 h-10 stroke-[1.5]" />
                                                <span className="text-xs mt-1">Dokumentasi Sekolah</span>
                                            </div>
                                        )}
                                        <span
                                            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${badge.bg} ${badge.text}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-normal">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>
                                                    {new Date(post.published_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                <Link href={route('public.posts.show', post.slug)}>
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="text-xs text-slate-600 font-normal line-clamp-3 leading-relaxed">
                                                {post.excerpt || 'Klik untuk melihat rincian isi artikel ini.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-normal">
                                                Penulis: {post.author?.name || 'Humas'}
                                            </span>
                                            <Link
                                                href={route('public.posts.show', post.slug)}
                                                className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                Baca
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500 space-y-2">
                        <Tag className="w-8 h-8 text-slate-400 mx-auto" />
                        <h3 className="text-base font-semibold text-slate-800">
                            Tidak Ada Konten Ditemukan
                        </h3>
                        <p className="text-xs text-slate-500 font-normal max-w-sm mx-auto">
                            Tidak ditemukan artikel yang sesuai dengan filter kategori atau pencarian Anda.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1.5 pt-6">
                        {posts.links.map((link, idx) => (
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
        </PublicLayout>
    );
}

