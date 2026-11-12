import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    CheckCircle,
    Copy,
    FileText,
    GraduationCap,
    Home,
    MapPin,
    Printer,
    Search,
    ShieldCheck,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface PpdbSuccessProps {
    applicant: {
        id: number;
        registration_number: string;
        nisn: string;
        nik: string;
        full_name: string;
        gender: string;
        birth_place: string;
        birth_date: string;
        address: string;
        province: string;
        city: string;
        district: string;
        phone_number: string;
        distance_zone_score: number;
        average_report_score: string;
        final_score: string;
        created_at: string;
        period?: { name: string };
        track?: { name: string; code: string };
        department?: { name: string; code: string };
        second_department?: { name: string; code: string };
    };
    schoolSettings: Record<string, string>;
}

export default function PpdbSuccess({ applicant, schoolSettings }: PpdbSuccessProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(applicant.registration_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <PublicLayout
            title="Pendaftaran Berhasil"
            description="Bukti Pendaftaran Calon Peserta Didik Baru Online."
        >
            <Head title={`Bukti Pendaftaran - ${applicant.registration_number}`} />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Printable Receipt Card */}
                    <div id="printable-ticket" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
                        {/* Header Success / Brand */}
                        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                Pendaftaran PPDB Berhasil Terkirim!
                            </h1>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                Terima kasih telah mendaftar di{' '}
                                <strong className="text-slate-800">
                                    {schoolSettings.school_name || 'SMK Eduvia Nusantara'}
                                </strong>
                                . Berkas Anda telah masuk ke sistem panitia untuk diverifikasi.
                            </p>
                        </div>

                        {/* Registration Number Highlight Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-2 shadow-md">
                            <span className="text-xs font-medium text-blue-200 uppercase tracking-widest">
                                Nomor Tiket Registrasi Resmi
                            </span>
                            <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider">
                                {applicant.registration_number}
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={handleCopy}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{copied ? 'Tersalin!' : 'Salin Nomor'}</span>
                                </button>
                            </div>
                            <p className="text-[11px] text-blue-200 pt-1">
                                * Simpan nomor registrasi ini untuk mengecek status verifikasi dan hasil kelulusan.
                            </p>
                        </div>

                        {/* Summary Data Table */}
                        <div className="space-y-4 text-xs">
                            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                                Ringkasan Data Pendaftar
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">Jalur Penerimaan:</div>
                                    <div className="font-bold text-slate-900">
                                        {applicant.track?.name || 'Reguler'} ({applicant.track?.code || 'REG'})
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">Pilihan Program Keahlian:</div>
                                    <div className="font-bold text-slate-900">
                                        1. {applicant.department?.name || '-'}
                                        {applicant.second_department && (
                                            <span className="text-slate-500 font-normal block text-[11px]">
                                                2. {applicant.second_department.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">Nama Calon Siswa:</div>
                                    <div className="font-bold text-slate-900">{applicant.full_name}</div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">NISN / NIK:</div>
                                    <div className="font-mono font-semibold text-slate-900">
                                        {applicant.nisn} / {applicant.nik}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">Tempat, Tanggal Lahir:</div>
                                    <div className="font-medium text-slate-900">
                                        {applicant.birth_place}, {formatDate(applicant.birth_date)}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400">No. WhatsApp Calon Siswa:</div>
                                    <div className="font-medium text-slate-900">{applicant.phone_number}</div>
                                </div>
                            </div>

                            {/* Zonasi & Skor Awal */}
                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="font-bold text-slate-900">
                                        Estimasi Skor Zonasi: {applicant.distance_zone_score} Poin
                                    </div>
                                    <div className="text-slate-500 text-[11px] mt-0.5">
                                        Domisili: Kec. {applicant.district}, {applicant.city}, {applicant.province}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-500 text-[11px]">Total Skor Perangkingan:</span>
                                    <div className="text-base font-black text-blue-700 font-mono">
                                        {applicant.final_score}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Hidden on Print) */}
                        <div className="print:hidden pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm transition-all"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Cetak Bukti Pendaftaran</span>
                            </button>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Link
                                    href={route('public.ppdb.check-status', { identifier: applicant.registration_number, birth_date: applicant.birth_date })}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Cek Status</span>
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Beranda</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

