import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Check,
    CheckCircle2,
    FileText,
    GraduationCap,
    HelpCircle,
    Info,
    MapPin,
    ShieldCheck,
    Upload,
    User,
    Users,
} from 'lucide-react';
import { ChangeEvent, FormEventHandler, useMemo, useState } from 'react';

interface PpdbTrack {
    id: number;
    name: string;
    code: string;
    quota: number;
    description: string | null;
}

interface PpdbPeriod {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
}

interface Department {
    id: number;
    name: string;
    code: string;
}

interface PpdbRegisterProps {
    period: PpdbPeriod;
    tracks: PpdbTrack[];
    departments: Department[];
    schoolSettings: Record<string, string>;
}

export default function PpdbRegister({
    period,
    tracks,
    departments,
    schoolSettings,
}: PpdbRegisterProps) {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        period_id: period.id,
        track_id: tracks[0]?.id || '',
        department_id: departments[0]?.id || '',
        second_department_id: departments[1]?.id || '',

        // Data Pribadi Siswa
        nisn: '',
        nik: '',
        full_name: '',
        gender: 'L',
        birth_place: '',
        birth_date: '',
        religion: 'Islam',
        address: '',
        province: schoolSettings.school_province || 'DKI Jakarta',
        city: schoolSettings.school_city || 'Jakarta Selatan',
        district: schoolSettings.school_district || 'Kebayoran Baru',
        village: '',
        phone_number: '',
        email: '',

        // Asal Sekolah
        previous_school_name: '',
        previous_school_address: '',
        graduation_year: new Date().getFullYear(),
        average_report_score: '',

        // Data Orang Tua
        father_name: '',
        father_occupation: '',
        father_phone: '',
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        guardian_name: '',
        guardian_occupation: '',
        guardian_phone: '',
        parent_income: 'Rp 3.000.000 - Rp 5.000.000',

        // File Berkas
        photo_file: null as File | null,
        family_card_file: null as File | null,
        birth_cert_file: null as File | null,
        graduation_cert_file: null as File | null,
        achievement_cert_file: null as File | null,
        assistance_card_file: null as File | null,

        agreement: false,
    });

    // Real-time live zonasi estimation
    const estimatedZoneScore = useMemo(() => {
        const sDist = (schoolSettings.school_district || 'Kebayoran Baru').toLowerCase();
        const sCity = (schoolSettings.school_city || 'Jakarta Selatan').toLowerCase();
        const sProv = (schoolSettings.school_province || 'DKI Jakarta').toLowerCase();

        const aDist = (data.district || '').toLowerCase();
        const aCity = (data.city || '').toLowerCase();
        const aProv = (data.province || '').toLowerCase();

        if (aDist && (aDist.includes(sDist) || sDist.includes(aDist))) return 3;
        if (aCity && (aCity.includes(sCity) || sCity.includes(aCity))) return 2;
        if (aProv && (aProv.includes(sProv) || sProv.includes(aProv))) return 1;
        return 0;
    }, [data.district, data.city, data.province, schoolSettings]);

    const stepTitles = [
        'Jalur & Kejuruan',
        'Data Siswa & Domisili',
        'Asal Sekolah & Nilai',
        'Data Orang Tua',
        'Upload Berkas',
        'Konfirmasi',
    ];

    const nextStep = () => {
        if (currentStep < 6) setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const handleFileChange = (field: keyof typeof data, file: File | null) => {
        setData(field as any, file);
    };

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('public.ppdb.store'), {
            forceFormData: true,
        });
    };

    return (
        <PublicLayout
            title="Formulir Pendaftaran PPDB"
            description="Formulir pendaftaran calon peserta didik baru online."
        >
            <Head title="Formulir Pendaftaran PPDB Online" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header Banner */}
                    <div className="text-center space-y-2">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                            Pendaftaran Online
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Formulir Calon Peserta Didik Baru
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            {period.name} — Harap isi seluruh informasi dengan data yang valid dan benar.
                        </p>
                    </div>

                    {/* Stepper Wizard Progress */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {stepTitles.map((title, idx) => {
                                const stepNum = idx + 1;
                                const isCurrent = stepNum === currentStep;
                                const isCompleted = stepNum < currentStep;

                                return (
                                    <div
                                        key={title}
                                        onClick={() => stepNum <= currentStep && setCurrentStep(stepNum)}
                                        className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                                            isCurrent
                                                ? 'bg-blue-50 text-blue-700 font-bold'
                                                : isCompleted
                                                ? 'text-emerald-700 cursor-pointer hover:bg-slate-50'
                                                : 'text-slate-400 opacity-60'
                                        }`}
                                    >
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                                isCurrent
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : isCompleted
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                                        </div>
                                        <span className="text-[11px] leading-tight line-clamp-1">{title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
                        <form onSubmit={submitForm} className="space-y-6">
                            {/* STEP 1: Jalur & Kejuruan */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 1: Pilih Jalur & Program Keahlian
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Tentukan jalur pendaftaran dan jurusan yang Anda minati.
                                        </p>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div>
                                            <InputLabel value="Jalur Pendaftaran *" />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                {tracks.map((t) => (
                                                    <label
                                                        key={t.id}
                                                        className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                                                            Number(data.track_id) === t.id
                                                                ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm'
                                                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-sm">{t.name}</span>
                                                            <input
                                                                type="radio"
                                                                name="track_id"
                                                                value={t.id}
                                                                checked={Number(data.track_id) === t.id}
                                                                onChange={() => setData('track_id', t.id)}
                                                                className="text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                                                            {t.description || 'Jalur seleksi resmi.'}
                                                        </p>
                                                        <div className="mt-3 pt-2 border-t border-slate-100/80 text-[11px] font-semibold text-slate-600">
                                                            Kuota Penerimaan: {t.quota} Siswa
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            <InputError message={errors.track_id} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <InputLabel htmlFor="dept_1" value="Pilihan Program Keahlian 1 (Utama) *" />
                                                <select
                                                    id="dept_1"
                                                    value={data.department_id}
                                                    onChange={(e) => setData('department_id', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                                    required
                                                >
                                                    <option value="">Pilih Program Keahlian</option>
                                                    {departments.map((d) => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.name} ({d.code})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.department_id} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="dept_2" value="Pilihan Program Keahlian 2 (Alternatif)" />
                                                <select
                                                    id="dept_2"
                                                    value={data.second_department_id}
                                                    onChange={(e) => setData('second_department_id', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                                >
                                                    <option value="">Tidak ada pilihan ke-2</option>
                                                    {departments
                                                        .filter((d) => d.id !== Number(data.department_id))
                                                        .map((d) => (
                                                            <option key={d.id} value={d.id}>
                                                                {d.name} ({d.code})
                                                            </option>
                                                        ))}
                                                </select>
                                                <InputError message={errors.second_department_id} className="mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Identitas & Domisili Siswa */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 2: Data Diri & Domisili Calon Siswa
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Masukkan identitas kependudukan dan alamat domisili untuk perhitungan zonasi jarak.
                                        </p>
                                    </div>

                                    {/* Live Zone Estimation Banner */}
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3 text-xs">
                                        <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-900">
                                                Estimasi Skor Jarak Zonasi:{' '}
                                                <span className="text-blue-700 font-extrabold text-sm">
                                                    Skor {estimatedZoneScore} Poin
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-[11px]">
                                                {estimatedZoneScore === 3 && 'Alamat Anda berada dalam 1 Kelurahan/Kecamatan dengan sekolah. Mendapatkan prioritas zonasi tertinggi!'}
                                                {estimatedZoneScore === 2 && 'Alamat Anda berada dalam 1 Kota/Kabupaten dengan sekolah.'}
                                                {estimatedZoneScore === 1 && 'Alamat Anda berada dalam 1 Provinsi dengan sekolah.'}
                                                {estimatedZoneScore === 0 && 'Alamat Anda terdeteksi di luar provinsi sekolah.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="nisn" value="NISN (10 Digit) *" />
                                                <TextInput
                                                    id="nisn"
                                                    type="text"
                                                    maxLength={10}
                                                    value={data.nisn}
                                                    onChange={(e) => setData('nisn', e.target.value.replace(/\D/g, ''))}
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    placeholder="0012345678"
                                                    required
                                                />
                                                <InputError message={errors.nisn} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="nik" value="NIK Calon Siswa (16 Digit) *" />
                                                <TextInput
                                                    id="nik"
                                                    type="text"
                                                    maxLength={16}
                                                    value={data.nik}
                                                    onChange={(e) => setData('nik', e.target.value.replace(/\D/g, ''))}
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    placeholder="3171012345670001"
                                                    required
                                                />
                                                <InputError message={errors.nik} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="full_name" value="Nama Lengkap Calon Siswa (Sesuai Akta/Ijazah) *" />
                                            <TextInput
                                                id="full_name"
                                                type="text"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                className="mt-1 block w-full text-xs"
                                                placeholder="Contoh: Muhammad Bintang Pratama"
                                                required
                                            />
                                            <InputError message={errors.full_name} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <InputLabel htmlFor="gender" value="Jenis Kelamin *" />
                                                <select
                                                    id="gender"
                                                    value={data.gender}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                                >
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="birth_place" value="Tempat Lahir *" />
                                                <TextInput
                                                    id="birth_place"
                                                    type="text"
                                                    value={data.birth_place}
                                                    onChange={(e) => setData('birth_place', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Jakarta"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir *" />
                                                <TextInput
                                                    id="birth_date"
                                                    type="date"
                                                    value={data.birth_date}
                                                    onChange={(e) => setData('birth_date', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    required
                                                />
                                                <InputError message={errors.birth_date} className="mt-1" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="phone_number" value="No. WhatsApp / Telepon Calon Siswa *" />
                                                <TextInput
                                                    id="phone_number"
                                                    type="text"
                                                    value={data.phone_number}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="081234567890"
                                                    required
                                                />
                                                <InputError message={errors.phone_number} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="email" value="Alamat Email (Opsional)" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="siswa@gmail.com"
                                                />
                                                <InputError message={errors.email} className="mt-1" />
                                            </div>
                                        </div>

                                        {/* Domisili Zonasi */}
                                        <div className="pt-2 border-t border-slate-100 space-y-4">
                                            <div>
                                                <InputLabel htmlFor="address" value="Alamat Lengkap Tempat Tinggal (Sesuai Kartu Keluarga) *" />
                                                <textarea
                                                    id="address"
                                                    rows={2}
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                                    placeholder="Jl. Merdeka No. 12 RT 02/RW 05"
                                                    required
                                                />
                                                <InputError message={errors.address} className="mt-1" />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="province" value="Provinsi *" />
                                                    <TextInput
                                                        id="province"
                                                        type="text"
                                                        value={data.province}
                                                        onChange={(e) => setData('province', e.target.value)}
                                                        className="mt-1 block w-full text-xs"
                                                        placeholder="DKI Jakarta"
                                                        required
                                                    />
                                                    <InputError message={errors.province} className="mt-1" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="city" value="Kota / Kabupaten *" />
                                                    <TextInput
                                                        id="city"
                                                        type="text"
                                                        value={data.city}
                                                        onChange={(e) => setData('city', e.target.value)}
                                                        className="mt-1 block w-full text-xs"
                                                        placeholder="Jakarta Selatan"
                                                        required
                                                    />
                                                    <InputError message={errors.city} className="mt-1" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="district" value="Kecamatan *" />
                                                    <TextInput
                                                        id="district"
                                                        type="text"
                                                        value={data.district}
                                                        onChange={(e) => setData('district', e.target.value)}
                                                        className="mt-1 block w-full text-xs"
                                                        placeholder="Kebayoran Baru"
                                                        required
                                                    />
                                                    <InputError message={errors.district} className="mt-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Asal Sekolah & Nilai */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 3: Asal Sekolah & Nilai Rapor
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Masukkan data sekolah asal (SMP/MTs) dan nilai rata-rata rapor untuk kalkulasi skor seleksi.
                                        </p>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div>
                                            <InputLabel htmlFor="prev_school" value="Nama Sekolah Asal (SMP / MTs) *" />
                                            <TextInput
                                                id="prev_school"
                                                type="text"
                                                value={data.previous_school_name}
                                                onChange={(e) => setData('previous_school_name', e.target.value)}
                                                className="mt-1 block w-full text-xs"
                                                placeholder="SMP Negeri 11 Jakarta"
                                                required
                                            />
                                            <InputError message={errors.previous_school_name} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="grad_year" value="Tahun Lulus *" />
                                                <TextInput
                                                    id="grad_year"
                                                    type="number"
                                                    value={data.graduation_year}
                                                    onChange={(e) => setData('graduation_year', parseInt(e.target.value) || 2026)}
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="avg_report" value="Rata-rata Nilai Rapor (Skala 0 - 100) *" />
                                                <TextInput
                                                    id="avg_report"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={data.average_report_score}
                                                    onChange={(e) => setData('average_report_score', e.target.value)}
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    placeholder="Contoh: 88.50"
                                                    required
                                                />
                                                <InputError message={errors.average_report_score} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="prev_school_addr" value="Alamat Sekolah Asal (Opsional)" />
                                            <TextInput
                                                id="prev_school_addr"
                                                type="text"
                                                value={data.previous_school_address}
                                                onChange={(e) => setData('previous_school_address', e.target.value)}
                                                className="mt-1 block w-full text-xs"
                                                placeholder="Jl. Iskandarsyah No. 1, Jakarta Selatan"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Data Orang Tua */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 4: Data Orang Tua / Wali
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Informasi kontak orang tua atau wali murid.
                                        </p>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <InputLabel htmlFor="father_name" value="Nama Lengkap Ayah" />
                                                <TextInput
                                                    id="father_name"
                                                    type="text"
                                                    value={data.father_name}
                                                    onChange={(e) => setData('father_name', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Nama Ayah"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="father_occ" value="Pekerjaan Ayah" />
                                                <TextInput
                                                    id="father_occ"
                                                    type="text"
                                                    value={data.father_occupation}
                                                    onChange={(e) => setData('father_occupation', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Karyawan Swasta"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="father_phone" value="No. Telepon / WA Ayah" />
                                                <TextInput
                                                    id="father_phone"
                                                    type="text"
                                                    value={data.father_phone}
                                                    onChange={(e) => setData('father_phone', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="081234567890"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                            <div>
                                                <InputLabel htmlFor="mother_name" value="Nama Lengkap Ibu" />
                                                <TextInput
                                                    id="mother_name"
                                                    type="text"
                                                    value={data.mother_name}
                                                    onChange={(e) => setData('mother_name', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Nama Ibu"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="mother_occ" value="Pekerjaan Ibu" />
                                                <TextInput
                                                    id="mother_occ"
                                                    type="text"
                                                    value={data.mother_occupation}
                                                    onChange={(e) => setData('mother_occupation', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Ibu Rumah Tangga / PNS"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="mother_phone" value="No. Telepon / WA Ibu" />
                                                <TextInput
                                                    id="mother_phone"
                                                    type="text"
                                                    value={data.mother_phone}
                                                    onChange={(e) => setData('mother_phone', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="081234567891"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <InputLabel htmlFor="parent_income" value="Rata-rata Penghasilan Orang Tua per Bulan" />
                                            <select
                                                id="parent_income"
                                                value={data.parent_income}
                                                onChange={(e) => setData('parent_income', e.target.value)}
                                                className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                            >
                                                <option value="Kurang dari Rp 1.500.000">Kurang dari Rp 1.500.000</option>
                                                <option value="Rp 1.500.000 - Rp 3.000.000">Rp 1.500.000 - Rp 3.000.000</option>
                                                <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                                                <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                                                <option value="Lebih dari Rp 10.000.000">Lebih dari Rp 10.000.000</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: Upload Berkas Dokumen */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 5: Upload Dokumen Persyaratan
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Unggah berkas digital scan/foto asli yang jelas (format JPG/PNG/PDF, maks. 3-4MB per berkas).
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                                        {/* Pas Foto */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Pas Foto Formal 3x4 *" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) => handleFileChange('photo_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                required
                                            />
                                            {data.photo_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.photo_file.name}
                                                </p>
                                            )}
                                            <InputError message={errors.photo_file} className="mt-1" />
                                        </div>

                                        {/* Kartu Keluarga */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Scan Kartu Keluarga (KK) *" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => handleFileChange('family_card_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                required
                                            />
                                            {data.family_card_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.family_card_file.name}
                                                </p>
                                            )}
                                            <InputError message={errors.family_card_file} className="mt-1" />
                                        </div>

                                        {/* Akta Kelahiran */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Scan Akta Kelahiran *" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => handleFileChange('birth_cert_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                required
                                            />
                                            {data.birth_cert_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.birth_cert_file.name}
                                                </p>
                                            )}
                                            <InputError message={errors.birth_cert_file} className="mt-1" />
                                        </div>

                                        {/* Ijazah / SKL / Rapor */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Scan Ijazah / SKL / Rapor *" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => handleFileChange('graduation_cert_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                required
                                            />
                                            {data.graduation_cert_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.graduation_cert_file.name}
                                                </p>
                                            )}
                                            <InputError message={errors.graduation_cert_file} className="mt-1" />
                                        </div>

                                        {/* Piagam Prestasi (Opsional) */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Sertifikat / Piagam Prestasi (Opsional)" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => handleFileChange('achievement_cert_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-800"
                                            />
                                            {data.achievement_cert_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.achievement_cert_file.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Kartu Bantuan KIP (Opsional) */}
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                                            <InputLabel value="Kartu Bantuan KIP / PKH / KKS (Opsional)" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => handleFileChange('assistance_card_file', e.target.files?.[0] || null)}
                                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-800"
                                            />
                                            {data.assistance_card_file && (
                                                <p className="text-[11px] text-emerald-600 font-medium">
                                                    ✓ Terpilih: {data.assistance_card_file.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 6: Review & Konfirmasi */}
                            {currentStep === 6 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="border-b border-slate-100 pb-4">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Langkah 6: Tinjauan Akhir & Konfirmasi Pendaftaran
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Harap tinjau kembali data pendaftaran Anda sebelum mengirim.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4 text-xs">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                                            <div>
                                                <span className="text-slate-400">Jalur Pendaftaran:</span>
                                                <div className="font-bold text-slate-900">
                                                    {tracks.find((t) => t.id === Number(data.track_id))?.name}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Pilihan Kejuruan:</span>
                                                <div className="font-bold text-slate-900">
                                                    1. {departments.find((d) => d.id === Number(data.department_id))?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200">
                                            <div>
                                                <span className="text-slate-400">NISN / NIK:</span>
                                                <div className="font-mono font-semibold text-slate-900">
                                                    {data.nisn} / {data.nik}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Nama Lengkap:</span>
                                                <div className="font-bold text-slate-900">{data.full_name}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Asal Sekolah:</span>
                                                <div className="font-semibold text-slate-900">
                                                    {data.previous_school_name} (Nilai: {data.average_report_score || '-'})
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-400">Domisili Tempat Tinggal:</span>
                                            <div className="font-medium text-slate-800">
                                                {data.address}, Kec. {data.district}, {data.city}, {data.province}
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>Estimasi Skor Zonasi: {estimatedZoneScore} Poin</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agreement Checkbox */}
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.agreement}
                                                onChange={(e) => setData('agreement', e.target.checked)}
                                                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                required
                                            />
                                            <span className="text-xs text-slate-700 leading-relaxed">
                                                Saya menyatakan bahwa seluruh data dan dokumen yang saya unggah adalah <strong>benar dan sah</strong>. Apabila di kemudian hari ditemukan ketidaksesuaian, saya bersedia menerima sanksi pembatalan kelulusan sesuai ketentuan sekolah.
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Stepper Navigation Buttons */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Kembali</span>
                                    </button>
                                ) : (
                                    <Link
                                        href={route('public.ppdb.index')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Batal</span>
                                    </Link>
                                )}

                                {currentStep < 6 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
                                    >
                                        <span>Lanjut</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing || !data.agreement}
                                        className="text-xs px-8 py-3"
                                    >
                                        {processing ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran PPDB'}
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

