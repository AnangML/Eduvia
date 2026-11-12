import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    CheckCircle,
    Clock,
    ExternalLink,
    FileCheck2,
    FileText,
    HelpCircle,
    Info,
    MapPin,
    RefreshCw,
    Search,
    ShieldAlert,
    Sparkles,
    Upload,
    User,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface DocumentItem {
    id: number;
    document_type: string;
    file_path: string;
    original_name: string;
    status: string;
    notes: string | null;
}

interface ApplicantData {
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
    ranking: number | null;
    verification_status: 'pending' | 'verified' | 'needs_revision' | 'rejected';
    verification_notes: string | null;
    verified_at: string | null;
    selection_status: 'unprocessed' | 'accepted' | 'waiting_list' | 'rejected';
    re_registration_status: 'not_registered' | 're_registered';
    created_at: string;
    period?: { name: string; announcement_date: string | null };
    track?: { name: string; code: string };
    department?: { name: string; code: string };
    second_department?: { name: string; code: string };
    documents: DocumentItem[];
}

interface CheckStatusProps {
    applicant: ApplicantData | null;
    searched: boolean;
    filters: {
        identifier?: string;
        birth_date?: string;
    };
    period?: { name: string; announcement_date: string | null } | null;
}

export default function CheckStatus({ applicant, searched, filters, period }: CheckStatusProps) {
    const searchForm = useForm({
        identifier: filters.identifier || '',
        birth_date: filters.birth_date || '',
    });

    const [selectedDocType, setSelectedDocType] = useState('graduation_certificate');
    const [reuploadFile, setReuploadFile] = useState<File | null>(null);
    const [isReuploading, setIsReuploading] = useState(false);

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        searchForm.get(route('public.ppdb.check-status'), {
            preserveState: true,
        });
    };

    const handleReupload: FormEventHandler = (e) => {
        e.preventDefault();
        if (!applicant || !reuploadFile) return;

        setIsReuploading(true);
        router.post(
            route('public.ppdb.reupload', applicant.registration_number),
            {
                document_type: selectedDocType,
                file: reuploadFile,
            },
            {
                forceFormData: true,
                onFinish: () => {
                    setIsReuploading(false);
                    setReuploadFile(null);
                },
            }
        );
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const docTypeLabels: Record<string, string> = {
        photo: 'Pas Foto 3x4',
        family_card: 'Kartu Keluarga (KK)',
        birth_certificate: 'Akta Kelahiran',
        graduation_certificate: 'Ijazah / SKL / Rapor',
        achievement_certificate: 'Sertifikat Prestasi',
        assistance_card: 'Kartu Bantuan KIP/PKH',
    };

    return (
        <PublicLayout
            title="Cek Status Pendaftaran PPDB"
            description="Pantau status verifikasi berkas dan pengumuman hasil seleksi kelulusan calon peserta didik baru."
        >
            <Head title="Cek Status Pendaftaran PPDB" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Page Header */}
                    <div className="text-center space-y-2">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                            Portal Mandiri
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Cek Status Pendaftaran PPDB
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Masukkan Nomor Registrasi resmi atau NISN beserta Tanggal Lahir Anda.
                        </p>
                    </div>

                    {/* Search Form Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <InputLabel htmlFor="identifier" value="Nomor Registrasi atau NISN *" />
                                    <TextInput
                                        id="identifier"
                                        type="text"
                                        value={searchForm.data.identifier}
                                        onChange={(e) => searchForm.setData('identifier', e.target.value)}
                                        placeholder="Contoh: PPDB2026-REG-0001 atau 0012345678"
                                        className="mt-1 block w-full text-xs font-mono"
                                        required
                                    />
                                    <InputError message={searchForm.errors.identifier} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="birth_date" value="Tanggal Lahir Calon Siswa *" />
                                    <TextInput
                                        id="birth_date"
                                        type="date"
                                        value={searchForm.data.birth_date}
                                        onChange={(e) => searchForm.setData('birth_date', e.target.value)}
                                        className="mt-1 block w-full text-xs"
                                        required
                                    />
                                    <InputError message={searchForm.errors.birth_date} className="mt-1" />
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={searchForm.processing}
                                    className="text-xs px-6 py-2.5 inline-flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>{searchForm.processing ? 'Mencari...' : 'Cek Status Sekarang'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Search Results */}
                    {searched && (
                        <div>
                            {applicant ? (
                                <div className="space-y-6 animate-in fade-in">
                                    {/* Main Status Hero Card */}
                                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                        {/* Status Top Banner */}
                                        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <span className="text-xs font-mono font-semibold text-blue-600 uppercase">
                                                    Tiket: {applicant.registration_number}
                                                </span>
                                                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                                                    {applicant.full_name}
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    NISN: {applicant.nisn} • Jalur {applicant.track?.name} • Pilihan 1: {applicant.department?.name}
                                                </p>
                                            </div>

                                            {/* Verification Badge */}
                                            <div>
                                                {applicant.verification_status === 'verified' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                        <span>Berkas Terverifikasi</span>
                                                    </span>
                                                )}
                                                {applicant.verification_status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                                                        <Clock className="w-4 h-4 text-amber-600" />
                                                        <span>Menunggu Verifikasi</span>
                                                    </span>
                                                )}
                                                {applicant.verification_status === 'needs_revision' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
                                                        <AlertCircle className="w-4 h-4 text-rose-600" />
                                                        <span>Perlu Perbaikan Berkas</span>
                                                    </span>
                                                )}
                                                {applicant.verification_status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                                                        <XCircle className="w-4 h-4 text-rose-600" />
                                                        <span>Berkas Ditolak</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Detail Body */}
                                        <div className="p-6 sm:p-8 space-y-6">
                                            {/* Announcement / Kelulusan Box */}
                                            {applicant.selection_status === 'accepted' && (
                                                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                                                        <Sparkles className="w-4 h-4" />
                                                        <span>Pengumuman Kelulusan Seleksi</span>
                                                    </div>
                                                    <h3 className="text-xl font-extrabold">
                                                        SELAMAT! Anda Dinyatakan Lolos & Diterima di {applicant.department?.name}
                                                    </h3>
                                                    <p className="text-xs text-emerald-100 leading-relaxed font-normal">
                                                        Selamat bergabung dengan civitas akademika kami. Harap segera mempersiapkan berkas fisik dan melakukan proses <strong>Daftar Ulang</strong> sesuai jadwal yang ditetapkan.
                                                    </p>
                                                    {applicant.ranking && (
                                                        <div className="inline-block px-3 py-1 rounded-lg bg-white/20 text-white font-mono text-xs font-bold">
                                                            Peringkat Seleksi: #{applicant.ranking}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {applicant.selection_status === 'waiting_list' && (
                                                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                                                    <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Status Cadangan / Waiting List</span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        Anda Berada Pada Daftar Tunggu (Peringkat #{applicant.ranking})
                                                    </h3>
                                                    <p className="text-xs text-slate-600 leading-relaxed">
                                                        Peringkat Anda berada pada batas kuota cadangan. Jika terdapat calon siswa yang tidak melakukan daftar ulang, posisi Anda akan berpeluang naik secara otomatis.
                                                    </p>
                                                </div>
                                            )}

                                            {applicant.selection_status === 'rejected' && (
                                                <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 space-y-2">
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        Mohon Maaf, Anda Belum Memenuhi Kuota Seleksi
                                                    </h3>
                                                    <p className="text-xs text-slate-600 leading-relaxed">
                                                        Berdasarkan perangkingan skor zonasi dan nilai rapor, kuota penerimaan jalur ini telah terpenuhi. Tetap semangat dalam menggapai cita-cita!
                                                    </p>
                                                </div>
                                            )}

                                            {applicant.selection_status === 'unprocessed' && (
                                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3 text-xs">
                                                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="font-bold">Tahap Evaluasi & Seleksi Sedang Berjalan</div>
                                                        <div className="text-slate-600 mt-0.5">
                                                            Hasil kelulusan akan diumumkan resmi pada{' '}
                                                            <strong>{formatDate(period?.announcement_date || applicant.period?.announcement_date)}</strong>. Pantau terus halaman ini secara berkala.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes / Revision Warning if needs_revision */}
                                            {applicant.verification_notes && (
                                                <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                                                    applicant.verification_status === 'needs_revision'
                                                        ? 'bg-rose-50 border border-rose-200 text-rose-900'
                                                        : 'bg-slate-50 border border-slate-200 text-slate-700'
                                                }`}>
                                                    <div className="font-bold flex items-center gap-1.5">
                                                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                                                        <span>Catatan dari Panitia PPDB:</span>
                                                    </div>
                                                    <p className="leading-relaxed pl-5">
                                                        {applicant.verification_notes}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Form Re-upload if needs_revision */}
                                            {applicant.verification_status === 'needs_revision' && (
                                                <div className="p-6 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/40 space-y-4">
                                                    <h4 className="text-sm font-bold text-rose-900">
                                                        Unggah Ulang Dokumen Perbaikan
                                                    </h4>
                                                    <form onSubmit={handleReupload} className="space-y-3 text-xs">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <InputLabel value="Pilih Jenis Dokumen yang Diperbaiki *" />
                                                                <select
                                                                    value={selectedDocType}
                                                                    onChange={(e) => setSelectedDocType(e.target.value)}
                                                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-rose-500 focus:border-rose-500"
                                                                >
                                                                    <option value="graduation_certificate">Ijazah / SKL / Rapor</option>
                                                                    <option value="family_card">Kartu Keluarga (KK)</option>
                                                                    <option value="birth_certificate">Akta Kelahiran</option>
                                                                    <option value="photo">Pas Foto Formal</option>
                                                                    <option value="achievement_certificate">Sertifikat Prestasi</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <InputLabel value="Pilih File Baru (JPG / PNG / PDF maks. 4MB) *" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg,image/png,application/pdf"
                                                                    onChange={(e) => setReuploadFile(e.target.files?.[0] || null)}
                                                                    className="mt-1 block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pt-2 flex justify-end">
                                                            <PrimaryButton
                                                                type="submit"
                                                                disabled={isReuploading || !reuploadFile}
                                                                className="text-xs px-6 py-2 bg-rose-600 hover:bg-rose-700"
                                                            >
                                                                {isReuploading ? 'Mengunggah...' : 'Kirim Berkas Perbaikan'}
                                                            </PrimaryButton>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                                                <div className="space-y-1">
                                                    <span className="text-slate-400">Skor Jarak Zonasi:</span>
                                                    <div className="font-bold text-slate-900">
                                                        {applicant.distance_zone_score} Poin (Kec. {applicant.district})
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-slate-400">Rata-rata Nilai Rapor:</span>
                                                    <div className="font-bold text-slate-900 font-mono">
                                                        {applicant.average_report_score}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-slate-400">Total Skor Akhir:</span>
                                                    <div className="font-bold text-blue-700 font-mono text-sm">
                                                        {applicant.final_score}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documents Checklist */}
                                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                                <h4 className="font-bold text-xs text-slate-900">
                                                    Dokumen Berkas yang Diunggah ({applicant.documents?.length || 0})
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                    {applicant.documents?.map((doc) => (
                                                        <div
                                                            key={doc.id}
                                                            className="p-3 rounded-xl border border-slate-200/90 bg-slate-50 flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                                                <div>
                                                                    <div className="font-semibold text-slate-900">
                                                                        {docTypeLabels[doc.document_type] || doc.document_type}
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                                                                        {doc.original_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={doc.file_path.startsWith('http') ? doc.file_path : `/storage/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors"
                                                                title="Lihat Dokumen"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-10 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Data Calon Siswa Tidak Ditemukan
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        Pastikan Nomor Registrasi atau NISN serta Tanggal Lahir yang Anda masukkan sudah benar dan sesuai dengan data pada saat formulir pendaftaran diisi.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

