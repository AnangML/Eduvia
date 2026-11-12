import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookOpen,
    Building2,
    Calendar,
    ChevronDown,
    CreditCard,
    FileText,
    Globe,
    GraduationCap,
    History,
    Image,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    Newspaper,
    School,
    Settings,
    Shield,
    UserCheck,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: typeof LayoutDashboard;
    roles?: string[];
    permission?: string;
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, school } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userRoles = user.roles || [];
    const isSuperAdmin = userRoles.includes('super_admin');
    const isAdmin = isSuperAdmin || userRoles.includes('admin');
    const isTeacher = isSuperAdmin || isAdmin || userRoles.includes('teacher') || userRoles.includes('homeroom_teacher');
    const isStudent = userRoles.includes('student');
    const isGuardian = userRoles.includes('guardian');

    // Human readable role badge
    const roleBadge = () => {
        if (isSuperAdmin) return 'Super Admin';
        if (userRoles.includes('admin')) return 'Tata Usaha';
        if (userRoles.includes('principal')) return 'Kepala Sekolah';
        if (userRoles.includes('homeroom_teacher')) return 'Wali Kelas';
        if (userRoles.includes('teacher')) return 'Guru';
        if (isStudent) return 'Siswa';
        if (isGuardian) return 'Wali Murid';
        if (userRoles.includes('prospective_student')) return 'Calon Siswa';
        return 'Pengguna';
    };

    const navigation: { group: string; items: NavItem[] }[] = [
        {
            group: 'Menu Utama',
            items: [
                {
                    name: 'Dashboard',
                    href: route('dashboard'),
                    icon: LayoutDashboard,
                },
            ],
        },
    ];

    if (isAdmin) {
        navigation.push(
            {
                group: 'Akademik & Siswa',
                items: [
                    { name: 'Tahun Ajaran & Semester', href: route('academic.years.index'), icon: Calendar },
                    { name: 'Rombongan Belajar (Kelas)', href: route('academic.classrooms.index'), icon: GraduationCap },
                    { name: 'Data Guru', href: route('academic.teachers.index'), icon: Users },
                    { name: 'Data Siswa', href: route('academic.students.index'), icon: Users },
                    { name: 'Mata Pelajaran', href: route('academic.subjects.index'), icon: BookOpen },
                    { name: 'Penugasan Mengajar', href: route('academic.teaching-assignments.index'), icon: BookOpen },
                ],
            },
            {
                group: 'Website & Publik (CMS)',
                items: [
                    { name: 'Profil Sekolah', href: route('cms.school-profile.index'), icon: School },
                    { name: 'Berita & Informasi', href: route('cms.posts.index'), icon: Newspaper },
                    { name: 'Fasilitas Sekolah', href: route('cms.facilities.index'), icon: Building2 },
                    { name: 'Galeri Foto', href: route('cms.galleries.index'), icon: Image },
                    { name: 'Pesan Masuk', href: route('cms.messages.index'), icon: Mail },
                ],
            },
            {
                group: 'PPDB Online',
                items: [
                    { name: 'Dashboard PPDB', href: route('ppdb.dashboard'), icon: BarChart3 },
                    { name: 'Gelombang & Jalur', href: route('ppdb.periods.index'), icon: Calendar },
                    { name: 'Data Pendaftar', href: route('ppdb.applicants.index'), icon: UserPlus },
                    { name: 'Seleksi Eliminasi', href: route('ppdb.selection.index'), icon: Award },
                    { name: 'Daftar Ulang & Siswa', href: route('ppdb.re-registration.index'), icon: UserCheck },
                ],
            },
            {
                group: 'Administrasi',
                items: [
                    { name: 'Keuangan & SSP', href: '#', icon: CreditCard },
                ],
            }
        );
    }

    if (isTeacher && !isAdmin) {
        navigation.push({
            group: 'Akademik Guru',
            items: [
                { name: 'Jadwal & Tugas', href: '#', icon: BookOpen },
                { name: 'Rekap Absensi', href: '#', icon: UserCheck },
                { name: 'Penilaian & Raport', href: '#', icon: FileText },
            ],
        });
    }

    if (isStudent) {
        navigation.push({
            group: 'Portal Siswa',
            items: [
                { name: 'Kehadiran Saya', href: '#', icon: UserCheck },
                { name: 'Raport Nilai', href: '#', icon: FileText },
                { name: 'Tagihan SPP', href: '#', icon: CreditCard },
            ],
        });
    }

    if (isGuardian) {
        navigation.push({
            group: 'Monitor Anak',
            items: [
                { name: 'Kehadiran Anak', href: '#', icon: UserCheck },
                { name: 'Raport Nilai', href: '#', icon: FileText },
                { name: 'Pembayaran SPP', href: '#', icon: CreditCard },
            ],
        });
    }

    if (isSuperAdmin) {
        navigation.push({
            group: 'Sistem & Keamanan',
            items: [
                { name: 'Audit Log', href: '#', icon: History },
                { name: 'Pengaturan Sekolah', href: '#', icon: Settings },
                { name: 'Hak Akses & Role', href: '#', icon: Shield },
            ],
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Logo Header */}
                <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-slate-200/80">
                    <Link href="/dashboard" className="flex items-center min-w-0 flex-1 mr-2">
                        <ApplicationLogo tagline="Portal Akademik" compact />
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden shrink-0"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                    {navigation.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                {section.group}
                            </h3>
                            <div className="mt-1 space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = item.href !== '#' && (
                                        typeof window !== 'undefined' && (
                                            window.location.href === item.href ||
                                            (item.href !== route('dashboard') && window.location.href.startsWith(item.href))
                                        )
                                    );
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                isActive
                                                    ? 'bg-brand-50 text-brand-600 font-semibold'
                                                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 ${
                                                    isActive ? 'text-brand-600' : 'text-slate-500'
                                                }`}
                                            />
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom User Profile */}
                <div className="shrink-0 p-4 border-t border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-slate-900 leading-tight">
                                {user.name}
                            </div>
                            <div className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium bg-brand-50 text-brand-700 border border-brand-200/60">
                                {roleBadge()}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        {header}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                                    <span className="hidden sm:inline-block truncate max-w-[150px]">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
                                    Login sebagai <strong className="text-slate-800">{user.email}</strong>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profil Saya
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    <span className="flex items-center gap-2 text-rose-600">
                                        <LogOut className="h-3.5 w-3.5" />
                                        Keluar
                                    </span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
