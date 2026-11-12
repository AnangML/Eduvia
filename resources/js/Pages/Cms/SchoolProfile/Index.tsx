import ImageUpload from '@/Components/ImageUpload';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Building,
    CheckCircle,
    Compass,
    Globe,
    History,
    Mail,
    MapPin,
    Phone,
    Save,
    Share2,
    Target,
    UserCheck,
} from 'lucide-react';
import { FormEventHandler } from 'react';

interface SchoolProfileProps {
    profile: {
        school_name: string;
        school_tagline: string;
        school_logo?: string;
        school_description: string;
        school_vision: string;
        school_mission: string;
        school_history: string;
        school_address: string;
        school_phone: string;
        school_email: string;
        school_map_embed: string;
        social_instagram: string;
        social_facebook: string;
        social_youtube: string;
        principal_name?: string;
        principal_title?: string;
        principal_photo?: string;
        principal_welcome?: string;
    };
}

export default function SchoolProfileIndex({ profile }: SchoolProfileProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        school_name: profile.school_name || '',
        school_tagline: profile.school_tagline || '',
        school_logo: profile.school_logo || '',
        school_description: profile.school_description || '',
        school_vision: profile.school_vision || '',
        school_mission: profile.school_mission || '',
        school_history: profile.school_history || '',
        school_address: profile.school_address || '',
        school_phone: profile.school_phone || '',
        school_email: profile.school_email || '',
        school_map_embed: profile.school_map_embed || '',
        social_instagram: profile.social_instagram || '',
        social_facebook: profile.social_facebook || '',
        social_youtube: profile.social_youtube || '',
        principal_name: profile.principal_name || '',
        principal_title: profile.principal_title || '',
        principal_photo: profile.principal_photo || '',
        principal_welcome: profile.principal_welcome || '',
        logo_file: null as File | null,
        principal_photo_file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(
            route('cms.school-profile.update'),
            {
                _method: 'put',
                ...data,
            },
            {
                forceFormData: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                        Profil & Identitas Sekolah (CMS)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Sesuaikan nama, visi misi, kontak resmi, dan tautan sosial media yang tampil di website publik.
                    </p>
                </div>
            }
        >
            <Head title="Profil & Identitas Sekolah" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Identitas Utama */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                    <Building className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Identitas Utama Lembaga
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Nama resmi dan motto lembaga yang tampil di header dan beranda.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <InputLabel htmlFor="school_name" value="Nama Sekolah *" />
                                    <TextInput
                                        id="school_name"
                                        type="text"
                                        value={data.school_name}
                                        className="mt-1 block w-full text-xs"
                                        onChange={(e) => setData('school_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.school_name} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_tagline" value="Tagline / Motto Sekolah" />
                                    <TextInput
                                        id="school_tagline"
                                        type="text"
                                        value={data.school_tagline}
                                        className="mt-1 block w-full text-xs"
                                        placeholder="Contoh: Membentuk Generasi Cerdas, Unggul, dan Berakhlak Mulia"
                                        onChange={(e) => setData('school_tagline', e.target.value)}
                                    />
                                    <InputError message={errors.school_tagline} className="mt-1" />
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Logo Resmi Sekolah"
                                        value={data.school_logo}
                                        onChangeFile={(file) => setData('logo_file', file)}
                                        aspectRatio="square"
                                        maxSizeMB={2}
                                        error={errors.school_logo || (errors as any).logo_file}
                                        helperText="Format PNG transparan atau SVG dianjurkan."
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_description" value="Deskripsi Singkat Profil" />
                                    <textarea
                                        id="school_description"
                                        rows={3}
                                        value={data.school_description}
                                        onChange={(e) => setData('school_description', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    />
                                    <InputError message={errors.school_description} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Visi, Misi, & Sejarah */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Visi, Misi & Sejarah Singkat
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Panduan nilai dan rekam jejak dedikasi institusi.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <InputLabel htmlFor="school_vision" value="Visi Sekolah" />
                                    <textarea
                                        id="school_vision"
                                        rows={3}
                                        value={data.school_vision}
                                        onChange={(e) => setData('school_vision', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    />
                                    <InputError message={errors.school_vision} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_mission" value="Misi Sekolah (Pisahkan per baris)" />
                                    <textarea
                                        id="school_mission"
                                        rows={4}
                                        value={data.school_mission}
                                        onChange={(e) => setData('school_mission', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    />
                                    <InputError message={errors.school_mission} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_history" value="Sejarah & Riwayat Lembaga" />
                                    <textarea
                                        id="school_history"
                                        rows={4}
                                        value={data.school_history}
                                        onChange={(e) => setData('school_history', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    />
                                    <InputError message={errors.school_history} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Kepala Sekolah & Sambutan */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Pimpinan & Sambutan Kepala Sekolah
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Data pimpinan institusi dan pesan sambutan yang tampil di Beranda dan halaman Tentang.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="principal_name" value="Nama Lengkap & Gelar Kepala Sekolah" />
                                        <TextInput
                                            id="principal_name"
                                            type="text"
                                            value={data.principal_name}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="Contoh: Drs. H. Hendra Setiawan, M.Pd."
                                            onChange={(e) => setData('principal_name', e.target.value)}
                                        />
                                        <InputError message={errors.principal_name} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="principal_title" value="Jabatan / Gelar Struktural" />
                                        <TextInput
                                            id="principal_title"
                                            type="text"
                                            value={data.principal_title}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="Contoh: Kepala Sekolah SMK Eduvia Nusantara"
                                            onChange={(e) => setData('principal_title', e.target.value)}
                                        />
                                        <InputError message={errors.principal_title} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Foto Formal Kepala Sekolah"
                                        value={data.principal_photo}
                                        onChangeFile={(file) => setData('principal_photo_file', file)}
                                        aspectRatio="portrait"
                                        maxSizeMB={3}
                                        error={errors.principal_photo || (errors as any).principal_photo_file}
                                        helperText="Foto portrait resmi berpakaian formal/jas."
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="principal_welcome" value="Teks Pesan & Sambutan Resmi" />
                                    <textarea
                                        id="principal_welcome"
                                        rows={6}
                                        value={data.principal_welcome}
                                        onChange={(e) => setData('principal_welcome', e.target.value)}
                                        placeholder="Tuliskan kata sambutan hangat dan visi kepemimpinan kepala sekolah..."
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600"
                                    />
                                    <InputError message={errors.principal_welcome} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Kontak & Alamat */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Kontak & Lokasi Kampus
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Informasi kontak resmi yang dicantumkan pada footer dan halaman kontak.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <InputLabel htmlFor="school_address" value="Alamat Lengkap" />
                                    <TextInput
                                        id="school_address"
                                        type="text"
                                        value={data.school_address}
                                        className="mt-1 block w-full text-xs"
                                        onChange={(e) => setData('school_address', e.target.value)}
                                    />
                                    <InputError message={errors.school_address} className="mt-1" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="school_phone" value="Nomor Telepon / WhatsApp" />
                                        <TextInput
                                            id="school_phone"
                                            type="text"
                                            value={data.school_phone}
                                            className="mt-1 block w-full text-xs"
                                            onChange={(e) => setData('school_phone', e.target.value)}
                                        />
                                        <InputError message={errors.school_phone} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="school_email" value="Alamat Email Resmi" />
                                        <TextInput
                                            id="school_email"
                                            type="email"
                                            value={data.school_email}
                                            className="mt-1 block w-full text-xs"
                                            onChange={(e) => setData('school_email', e.target.value)}
                                        />
                                        <InputError message={errors.school_email} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_map_embed" value="Kode Semat Peta (Google Maps Iframe HTML)" />
                                    <textarea
                                        id="school_map_embed"
                                        rows={2}
                                        value={data.school_map_embed}
                                        onChange={(e) => setData('school_map_embed', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs focus:ring-blue-600/20 focus:border-blue-600 font-mono"
                                        placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                                    />
                                    <InputError message={errors.school_map_embed} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Media Sosial */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Akun Media Sosial Resmi
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Tautan channel media sosial resmi sekolah.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <InputLabel htmlFor="social_instagram" value="Instagram URL" />
                                    <TextInput
                                        id="social_instagram"
                                        type="text"
                                        value={data.social_instagram}
                                        className="mt-1 block w-full text-xs"
                                        placeholder="https://instagram.com/..."
                                        onChange={(e) => setData('social_instagram', e.target.value)}
                                    />
                                    <InputError message={errors.social_instagram} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="social_facebook" value="Facebook URL" />
                                    <TextInput
                                        id="social_facebook"
                                        type="text"
                                        value={data.social_facebook}
                                        className="mt-1 block w-full text-xs"
                                        placeholder="https://facebook.com/..."
                                        onChange={(e) => setData('social_facebook', e.target.value)}
                                    />
                                    <InputError message={errors.social_facebook} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="social_youtube" value="YouTube Channel URL" />
                                    <TextInput
                                        id="social_youtube"
                                        type="text"
                                        value={data.social_youtube}
                                        className="mt-1 block w-full text-xs"
                                        placeholder="https://youtube.com/@..."
                                        onChange={(e) => setData('social_youtube', e.target.value)}
                                    />
                                    <InputError message={errors.social_youtube} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center justify-end gap-4">
                            {recentlySuccessful && (
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4" />
                                    Profil sekolah berhasil disimpan!
                                </span>
                            )}
                            <PrimaryButton disabled={processing} className="text-xs gap-2">
                                <Save className="w-3.5 h-3.5" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

