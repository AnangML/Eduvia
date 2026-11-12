import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CheckCircle,
    ChevronRight,
    GraduationCap,
    Info,
    Mail,
    MapPin,
    Menu,
    Phone,
    Users,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface SchoolProfile {
    school_name: string;
    school_tagline: string;
    school_description?: string;
    school_address?: string;
    school_phone?: string;
    school_email?: string;
    social_instagram?: string;
    social_facebook?: string;
    social_youtube?: string;
}

interface PublicLayoutProps {
    title?: string;
    description?: string;
    image?: string;
    profile?: SchoolProfile;
}

export default function PublicLayout({
    title,
    description = 'Sistem Informasi Manajemen Sekolah Terpadu dan Unggul.',
    image,
    profile,
    children,
}: PropsWithChildren<PublicLayoutProps>) {
    const pageProps = usePage().props as unknown as {
        auth?: { user?: { name: string } | null };
        school?: { name?: string; tagline?: string; logo?: string };
        flash?: { success?: string; error?: string };
    };
    const auth = pageProps.auth;
    const school = pageProps.school;
    const flash = pageProps.flash;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const schoolName = profile?.school_name || school?.name || 'SMK Eduvia Nusantara';
    const schoolTagline = profile?.school_tagline || school?.tagline || 'Maju Bersama, Berakhlak Mulia';
    const schoolLogo = (profile as any)?.school_logo || school?.logo;
    const pageTitle = title ? `${title} | ${schoolName}` : schoolName;

    const currentUrl = usePage().url;

    const navLinks = [
        { name: 'Beranda', href: route('home'), active: currentUrl === '/' || route().current('home') },
        { name: 'Tentang', href: route('public.about'), active: currentUrl.startsWith('/tentang') || route().current('public.about') },
        { name: 'Berita & Agenda', href: route('public.posts.index'), active: currentUrl.startsWith('/berita') || route().current('public.posts.*') },
        { name: 'Fasilitas', href: route('public.facilities'), active: currentUrl.startsWith('/fasilitas') || route().current('public.facilities') },
        { name: 'Direktori Guru', href: route('public.teachers'), active: currentUrl.startsWith('/guru') || route().current('public.teachers') },
        { name: 'Galeri', href: route('public.galleries'), active: currentUrl.startsWith('/galeri') || route().current('public.galleries') },
        { name: 'PPDB Online', href: route('public.ppdb.index'), active: currentUrl.startsWith('/ppdb') || route().current('public.ppdb.*'), badge: 'Buka' },
        { name: 'Kontak', href: route('public.contact'), active: currentUrl.startsWith('/kontak') || route().current('public.contact*') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                {image && <meta property="og:image" content={image} />}
                <meta property="og:type" content="website" />
            </Head>

            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Brand Logo & School Name on Far Left */}
                        <Link href={route('home')} className="flex items-center group shrink-0">
                            <ApplicationLogo
                                name={schoolName}
                                tagline={schoolTagline}
                                logoUrl={schoolLogo}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                                        link.active
                                            ? 'text-blue-600 bg-blue-50 font-semibold'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {(link as any).badge && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                                            {(link as any).badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Portal / Login Action on Far Right */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    <span>Dashboard</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    <span>Portal Masuk</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu trigger */}
                        <div className="lg:hidden flex items-center gap-2">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white"
                                >
                                    Login
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                                    link.active
                                        ? 'text-blue-600 bg-blue-50 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`}
                            >
                                <span>{link.name}</span>
                                {(link as any).badge && (
                                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                                        {(link as any).badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Flash notifications */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p>{flash.success}</p>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                        <Info className="w-5 h-5 text-rose-600 shrink-0" />
                        <p>{flash.error}</p>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand & Tagline */}
                        {/* Profil Ringkas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {schoolLogo ? (
                                    <img
                                        src={schoolLogo}
                                        alt={schoolName}
                                        className="h-10 w-10 shrink-0 object-contain rounded-xl bg-white p-1"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                )}
                                <span className="text-xl font-bold text-white tracking-tight">
                                    {schoolName}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-normal">
                                {schoolTagline}
                            </p>
                            <div className="pt-2 text-xs text-slate-500">
                                Terakreditasi A • Berbasis Standar Industri
                            </div>
                        </div>

                        {/* Navigasi Cepat */}
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider mb-4">
                                Navigasi Cepat
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href={route('public.about')} className="hover:text-blue-400 transition-colors">
                                        Tentang & Visi Misi
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.posts.index')} className="hover:text-blue-400 transition-colors">
                                        Berita & Pengumuman
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.facilities')} className="hover:text-blue-400 transition-colors">
                                        Fasilitas Kampus
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.teachers')} className="hover:text-blue-400 transition-colors">
                                        Tenaga Pendidik
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.galleries')} className="hover:text-blue-400 transition-colors">
                                        Dokumentasi Galeri
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Kontak Sekolah */}
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider mb-4">
                                Kontak Resmi
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-400 font-normal">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <span>{profile?.school_address || 'Jl. Pendidikan Mandiri No. 102, Jakarta'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span>{profile?.school_phone || '(021) 555-0192'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span>{profile?.school_email || 'info@eduvia.sch.id'}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layanan Digital */}
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider mb-4">
                                Layanan Terpadu
                            </h3>
                            <p className="text-sm text-slate-400 mb-4 leading-relaxed font-normal">
                                Akses portal akademik untuk monitoring presensi, nilai, serta transparansi pembayaran sekolah.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors"
                            >
                                Masuk ke Portal Akademik
                                <ChevronRight className="w-4 h-4 text-blue-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Bottom separator */}
                    <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} {schoolName}. Hak Cipta Dilindungi.</p>
                        <p className="flex items-center gap-1 font-normal">
                            Didukung oleh platform manajemen pendidikan <span className="text-slate-300 font-medium">Eduvia</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

