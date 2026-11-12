import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    Share2,
    Tag,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface PostDetailProps {
    profile: {
        school_name: string;
        school_tagline: string;
    };
    post: {
        id: number;
        title: string;
        slug: string;
        category: string;
        excerpt: string | null;
        content: string;
        featured_image: string | null;
        published_at: string;
        event_date: string | null;
        views_count: number;
        author?: { name: string };
    };
    relatedPosts: Array<{
        id: number;
        title: string;
        slug: string;
        category: string;
        published_at: string;
        featured_image: string | null;
    }>;
}

export default function PostShow({ profile, post, relatedPosts }: PostDetailProps) {
    const [copied, setCopied] = useState(false);

    const categoryBadges: Record<string, { label: string; bg: string; text: string }> = {
        news: { label: 'Berita', bg: 'bg-blue-50', text: 'text-blue-700' },
        announcement: { label: 'Pengumuman', bg: 'bg-amber-50', text: 'text-amber-700' },
        achievement: { label: 'Prestasi', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        agenda: { label: 'Agenda', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    };

    const currentBadge = categoryBadges[post.category] || {
        label: post.category,
        bg: 'bg-slate-100',
        text: 'text-slate-700',
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <PublicLayout
            title={post.title}
            description={post.excerpt || post.title}
            image={post.featured_image || undefined}
            profile={{ school_name: profile.school_name, school_tagline: profile.school_tagline }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back button */}
                <div>
                    <Link
                        href={route('public.posts.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Kabar & Informasi</span>
                    </Link>
                </div>

                {/* Article Header */}
                <header className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-md text-xs font-semibold ${currentBadge.bg} ${currentBadge.text}`}
                        >
                            {currentBadge.label}
                        </span>
                        {post.event_date && (
                            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Waktu Kegiatan: {new Date(post.event_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-snug">
                        {post.title}
                    </h1>

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center justify-between py-3 border-y border-slate-200/80 gap-3 text-xs text-slate-500 font-normal">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-slate-400" />
                                {post.author?.name || 'Humas Sekolah'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {new Date(post.published_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4 text-slate-400" />
                                {post.views_count} x dibaca
                            </span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
                        </button>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm max-h-[460px]">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="prose prose-slate max-w-none text-base text-slate-700 font-normal leading-relaxed whitespace-pre-line py-4">
                    {post.content}
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="pt-10 border-t border-slate-200 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Konten Terkait Lainnya
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {relatedPosts.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={route('public.posts.show', rel.slug)}
                                    className="group rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-slate-400 font-normal">
                                            {new Date(rel.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {rel.title}
                                        </h3>
                                    </div>
                                    <span className="text-xs font-medium text-blue-600 mt-4">
                                        Baca selengkapnya →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

