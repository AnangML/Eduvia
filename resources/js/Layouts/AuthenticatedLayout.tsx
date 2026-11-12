import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Calendar,
    ChevronDown,
    CreditCard,
    FileText,
    GraduationCap,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Shield,
    UserCheck,
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
                    { name: 'Master Akademik', href: '#', icon: Calendar },
                    { name: 'Data Guru', href: '#', icon: Users },
                    { name: 'Data Siswa & Kelas', href: '#', icon: GraduationCap },
                    { name: 'Mata Pelajaran', href: '#', icon: BookOpen },
                ],
            },
            {
                group: 'Administrasi',
                items: [
                    { name: 'PPDB Online', href: '#', icon: UserCheck },
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
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80">
                    <Link href="/dashboard" className="flex items-center">
                        <ApplicationLogo />
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* School Name Badge */}
                <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-200/60">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Institusi Aktif
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                        {school?.name || 'SMK Eduvia Nusantara'}
                    </div>
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
                                    const isActive = item.href === route('dashboard');
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
                <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
