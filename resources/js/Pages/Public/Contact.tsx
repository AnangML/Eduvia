import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PublicLayout from '@/Layouts/PublicLayout';
import { useForm } from '@inertiajs/react';
import {
    Clock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
} from 'lucide-react';
import { FormEventHandler } from 'react';

interface ContactProps {
    profile: {
        school_name: string;
        school_tagline: string;
        school_address: string;
        school_phone: string;
        school_email: string;
        school_map_embed?: string;
    };
}

export default function Contact({ profile }: ContactProps) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('public.contact.submit'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout
            title="Hubungi Kami"
            description={`Kontak resmi, lokasi kampus, dan formulir layanan pesan ${profile.school_name}.`}
            profile={profile}
        >
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Layanan Komunikasi
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Hubungi Kami
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
                        Kami siap membantu menjawab pertanyaan Anda seputar informasi pendaftaran, akademik, dan kemitraan.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">
                                Informasi Kontak Sekolah
                            </h2>

                            <ul className="space-y-5 text-sm text-slate-600 font-normal">
                                <li className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Alamat Kampus</div>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            {profile.school_address || 'Jl. Pendidikan Mandiri No. 102, Jakarta'}
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Telepon & WhatsApp</div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {profile.school_phone || '(021) 555-0192'}
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Email Resmi</div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {profile.school_email || 'info@eduvia.sch.id'}
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Jam Operasional Layanan</div>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            Senin – Jumat: 07.00 – 16.00 WIB<br />
                                            Sabtu: 08.00 – 13.00 WIB
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Map or Location card */}
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm overflow-hidden">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                Peta Lokasi Kampus
                            </h3>
                            {profile.school_map_embed ? (
                                <div
                                    className="aspect-video w-full rounded-xl overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: profile.school_map_embed }}
                                />
                            ) : (
                                <div className="h-44 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                                    <MapPin className="w-8 h-8 mb-1" />
                                    <span className="text-xs">Lokasi kampus terjangkau transportasi umum</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Message Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                    <span>Kirimkan Pesan atau Pertanyaan</span>
                                </h2>
                                <p className="text-xs text-slate-500 font-normal">
                                    Pesan Anda akan langsung terkirim ke kotak masuk manajemen sekolah.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Nama Lengkap *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="Contoh: Budi Santoso"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Alamat Email *" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="nama@email.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="phone" value="Nomor WhatsApp / HP" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="08xxxxxxxxxx"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="subject" value="Perihal / Judul Pesan *" />
                                        <TextInput
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            className="mt-1 block w-full text-xs"
                                            placeholder="Contoh: Informasi Pendaftaran Siswa Baru"
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.subject} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="message" value="Isi Pesan *" />
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-200 text-xs shadow-sm focus:border-blue-600 focus:ring-blue-600/20"
                                        placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan..."
                                        required
                                    />
                                    <InputError message={errors.message} className="mt-1" />
                                </div>

                                <div className="pt-2">
                                    <PrimaryButton
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{processing ? 'Mengirim...' : 'Kirim Pesan Sekarang'}</span>
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

