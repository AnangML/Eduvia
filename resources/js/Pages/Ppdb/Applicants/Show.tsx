import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    CheckCircle,
    Clock,
    ExternalLink,
    FileCheck2,
    FileText,
    MapPin,
    ShieldCheck,
    User,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react';
import { FormEventHandler } from 'react';

interface DocumentItem {
    id: number;
    document_type: string;
    file_path: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    status: string;
    notes: string | null;
}

interface ApplicantDetail {
    id: number;
    registration_number: string;
    nisn: string;
    nik: string;
    full_name: string;
    gender: string;
    birth_place: string;
    birth_date: string;
    religion: string | null;
    address: string;
    province: string;
    city: string;
    district: string;
    village: string | null;
    phone_number: string;
    email: string | null;
    distance_zone_score: number;
    average_report_score: string;
    final_score: string;
    ranking: number | null;
    previous_school_name: string;
    previous_school_address: string | null;
    graduation_year: number;
    father_name: string | null;
    father_occupation: string | null;
    father_phone: string | null;
    mother_name: string | null;
    mother_occupation: string | null;
    mother_phone: string | null;
    guardian_name: string | null;
    guardian_occupation: string | null;
    guardian_phone: string | null;
    parent_income: string | null;
    verification_status: string;
    verification_notes: string | null;
    verified_at: string | null;
    selection_status: string;
    re_registration_status: string;
    converted_to_student_id: number | null;
    created_at: string;
    period?: { name: string };
    track?: { name: string; code: string };
    department?: { name: string; code: string };
    second_department?: { name: string; code: string };
    documents: DocumentItem[];
    verified_by?: { name: string };
}

interface ShowProps {
    applicant: ApplicantDetail;
}

export default function ApplicantShow({ applicant }: ShowProps) {
    const { data, setData, post, processing, errors } = useForm({
        verification_status: applicant.verification_status,
        verification_notes: applicant.verification_notes || '',
        average_report_score: applicant.average_report_score,
        distance_zone_score: applicant.distance_zone_score,
    });

    const handleVerify: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('ppdb.applicants.verify', applicant.id));
    };

    const docTypeLabels: Record<string, string> = {
        photo: 'Pas Foto Formal (3x4)',
        family_card: 'Kartu Keluarga (KK)',
        birth_certificate: 'Akta Kelahiran',
        graduation_certificate: 'Ijazah / SKL / Rapor',
        achievement_certificate: 'Piagam / Sertifikat Prestasi',
        assistance_card: 'Kartu Bantuan KIP/PKH',
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('ppdb.applicants.index')}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                    {applicant.full_name}
                                </h2>
                                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                    {applicant.registration_number}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Terdaftar pada {formatDate(applicant.created_at)} • Jalur {applicant.track?.name}
                            </p>
                        </div>
                    </div>

                    {applicant.selection_status === 'accepted' && !applicant.converted_to_student_id && (
                        <Link
                            href={route('ppdb.re-registration.index')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>Konversi ke Siswa Aktif</span>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={`Detail Pendaftar - ${applicant.full_name}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left 2 Cols: Details & Documents */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal & School Info */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 text-xs">
                                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                                    Identitas Calon Siswa & Asal Sekolah
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-slate-400">NISN / NIK:</span>
                                        <div className="font-mono font-bold text-slate-900 mt-0.5">
                                            {applicant.nisn} / {applicant.nik}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Jenis Kelamin:</span>
                                        <div className="font-semibold text-slate-900 mt-0.5">
                                            {applicant.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Tempat, Tanggal Lahir:</span>
                                        <div className="font-semibold text-slate-900 mt-0.5">
                                            {applicant.birth_place}, {formatDate(applicant.birth_date)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Pilihan Kejuruan 1 (Utama):</span>
                                        <div className="font-bold text-blue-700 mt-0.5">
                                            {applicant.department?.name || '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Pilihan Kejuruan 2:</span>
                                        <div className="font-semibold text-slate-700 mt-0.5">
                                            {applicant.second_department?.name || '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">No. WhatsApp Calon Siswa:</span>
                                        <div className="font-mono font-semibold text-slate-900 mt-0.5">
                                            {applicant.phone_number}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-400">Sekolah Asal:</span>
                                        <div className="font-bold text-slate-900 mt-0.5">
                                            {applicant.previous_school_name} (Lulus {applicant.graduation_year})
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Rata-rata Rapor:</span>
                                        <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                                            {applicant.average_report_score}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100">
                                    <span className="text-slate-400">Domisili Tempat Tinggal:</span>
                                    <div className="font-medium text-slate-800 mt-0.5">
                                        {applicant.address}, Kec. {applicant.district}, {applicant.city}, {applicant.province}
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold text-[11px]">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Skor Jarak Zonasi: {applicant.distance_zone_score} Poin</span>
                                    </div>
                                </div>
                            </div>

                            {/* Data Orang Tua */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 text-xs">
                                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                                    Data Orang Tua / Wali
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="font-bold text-slate-800">Data Ayah Kandung</span>
                                        <div>Nama: <strong>{applicant.father_name || '-'}</strong></div>
                                        <div>Pekerjaan: {applicant.father_occupation || '-'}</div>
                                        <div>Telepon: {applicant.father_phone || '-'}</div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="font-bold text-slate-800">Data Ibu Kandung</span>
                                        <div>Nama: <strong>{applicant.mother_name || '-'}</strong></div>
                                        <div>Pekerjaan: {applicant.mother_occupation || '-'}</div>
                                        <div>Telepon: {applicant.mother_phone || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen Berkas */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                                    <span>Dokumen Berkas Persyaratan ({applicant.documents?.length || 0})</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    {applicant.documents?.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">
                                                        {docTypeLabels[doc.document_type] || doc.document_type}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                                                        {doc.original_name}
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={doc.file_path.startsWith('http') ? doc.file_path : `/storage/${doc.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                                            >
                                                <span>Buka</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right 1 Col: Verification Actions & Score Card */}
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    <span>Kalkulasi Skor Eliminasi</span>
                                </h3>

                                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
                                    <span className="text-xs text-blue-800 font-medium">Total Skor Perangkingan</span>
                                    <div className="text-3xl font-black text-blue-900 font-mono">
                                        {applicant.final_score}
                                    </div>
                                    {applicant.ranking && (
                                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-xs font-bold mt-1">
                                            Peringkat Seleksi: #{applicant.ranking}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex justify-between py-1 border-b border-slate-100">
                                        <span>Skor Zonasi Wilayah:</span>
                                        <strong>{applicant.distance_zone_score} (× 100)</strong>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-100">
                                        <span>Rata-rata Nilai Rapor:</span>
                                        <strong className="font-mono">{applicant.average_report_score}</strong>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-100">
                                        <span>Status Seleksi Kelulusan:</span>
                                        <strong className="uppercase font-bold text-blue-700">
                                            {applicant.selection_status}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Form Card */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                                    <span>Keputusan Verifikasi Panitia</span>
                                </h3>

                                <form onSubmit={handleVerify} className="space-y-4 text-xs">
                                    <div>
                                        <InputLabel value="Status Verifikasi Dokumen *" />
                                        <select
                                            value={data.verification_status}
                                            onChange={(e) => setData('verification_status', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-xs font-semibold focus:ring-blue-600/20 focus:border-blue-600"
                                            required
                                        >
                                            <option value="pending">Menunggu Verifikasi</option>
                                            <option value="verified">Terverifikasi (Lengkap & Valid)</option>
                                            <option value="needs_revision">Perlu Perbaikan (Ada Berkas Buram/Salah)</option>
                                            <option value="rejected">Ditolak (Tidak Memenuhi Syarat)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel value="Koreksi Rata-rata Rapor (Bila Salah)" />
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            value={data.average_report_score}
                                            onChange={(e) => setData('average_report_score', e.target.value)}
                                            className="mt-1 block w-full text-xs font-mono"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel value="Koreksi Skor Zonasi (0, 1, 2, 3)" />
                                        <select
                                            value={data.distance_zone_score}
                                            onChange={(e) => setData('distance_zone_score', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-xs font-mono"
                                        >
                                            <option value={3}>Skor 3 (Satu Kelurahan/Kecamatan)</option>
                                            <option value={2}>Skor 2 (Satu Kota/Kabupaten)</option>
                                            <option value={1}>Skor 1 (Satu Provinsi)</option>
                                            <option value={0}>Skor 0 (Luar Provinsi)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel value="Catatan untuk Pendaftar (Bila Revisi/Tolak)" />
                                        <textarea
                                            rows={3}
                                            value={data.verification_notes}
                                            onChange={(e) => setData('verification_notes', e.target.value)}
                                            placeholder="Contoh: Scan KK buram pada bagian NIK orang tua, harap upload ulang..."
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                        />
                                    </div>

                                    {applicant.verified_by && (
                                        <div className="text-[11px] text-slate-400">
                                            Diverifikasi oleh: <strong>{applicant.verified_by.name}</strong> pada {formatDate(applicant.verified_at)}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                            className="w-full justify-center text-xs py-2.5"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Status Verifikasi'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

