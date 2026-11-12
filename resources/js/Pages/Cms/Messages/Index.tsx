import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Mail,
    MailOpen,
    Phone,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface ContactMessageItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

interface MessagesCmsProps {
    messages: {
        data: ContactMessageItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function MessagesCmsIndex({ messages }: MessagesCmsProps) {
    const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

    const openMessage = (msg: ContactMessageItem) => {
        setSelectedMessage(msg);
        if (!msg.is_read) {
            router.post(route('cms.messages.read', msg.id), {}, { preserveScroll: true });
        }
    };

    const handleDelete = (msg: ContactMessageItem) => {
        if (confirm(`Hapus pesan dari "${msg.name}"?`)) {
            router.delete(route('cms.messages.destroy', msg.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                        Kotak Masuk Pesan Publik (CMS)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Pesan, pertanyaan, dan umpan balik yang dikirimkan oleh pengunjung melalui formulir kontak website.
                    </p>
                </div>
            }
        >
            <Head title="Kotak Masuk Pesan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Pengirim</th>
                                        <th className="px-6 py-3.5">Perihal</th>
                                        <th className="px-6 py-3.5">Waktu Masuk</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {messages.data.length > 0 ? (
                                        messages.data.map((msg) => (
                                            <tr
                                                key={msg.id}
                                                className={`hover:bg-slate-50/70 transition-colors ${
                                                    !msg.is_read ? 'bg-blue-50/30 font-medium' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {msg.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-normal">
                                                        {msg.email} {msg.phone ? `• ${msg.phone}` : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800 line-clamp-1">
                                                        {msg.subject}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-normal line-clamp-1 max-w-md">
                                                        {msg.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-[11px] whitespace-nowrap">
                                                    {new Date(msg.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {!msg.is_read ? (
                                                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                                            <Mail className="w-3 h-3" />
                                                            Belum Dibaca
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-normal">
                                                            <MailOpen className="w-3 h-3" />
                                                            Sudah Dibaca
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openMessage(msg)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Buka Pesan"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(msg)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                            title="Hapus Pesan"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                Belum ada pesan masuk di formulir kontak.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Pesan */}
            <Modal show={!!selectedMessage} onClose={() => setSelectedMessage(null)} maxWidth="lg">
                {selectedMessage && (
                    <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    {selectedMessage.subject}
                                </h3>
                                <div className="text-xs text-slate-400 font-normal mt-1">
                                    Diterima pada {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Dibaca
                            </span>
                        </div>

                        {/* Sender details */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <User className="w-4 h-4 text-slate-400" />
                                <span>{selectedMessage.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                                    {selectedMessage.email}
                                </a>
                            </div>
                            {selectedMessage.phone && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{selectedMessage.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Message body */}
                        <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed p-2">
                            {selectedMessage.message}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Balasan: ${encodeURIComponent(
                                    selectedMessage.subject
                                )}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Balas via Email</span>
                            </a>

                            <SecondaryButton onClick={() => setSelectedMessage(null)}>
                                Tutup
                            </SecondaryButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}

