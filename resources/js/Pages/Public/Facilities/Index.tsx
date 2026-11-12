import PublicLayout from '@/Layouts/PublicLayout';
import { Building2 } from 'lucide-react';

interface FacilitiesProps {
    profile: {
        school_name: string;
        school_tagline: string;
    };
    facilities: Array<{
        id: number;
        name: string;
        description: string | null;
        image_path: string | null;
    }>;
}

export default function FacilitiesIndex({ profile, facilities }: FacilitiesProps) {
    return (
        <PublicLayout
            title="Sarana & Fasilitas Kampus"
            description={`Daftar sarana prasarana dan fasilitas pendukung pembelajaran di ${profile.school_name}.`}
            profile={{ school_name: profile.school_name, school_tagline: profile.school_tagline }}
        >
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Sarana Prasarana
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Fasilitas Kampus Unggulan
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
                        Mendukung proses belajar mengajar dengan standar teknologi dan kenyamanan optimal.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {facilities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((facility) => (
                            <div
                                key={facility.id}
                                className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                            >
                                <div className="h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {facility.image_path ? (
                                        <img
                                            src={facility.image_path}
                                            alt={facility.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="text-slate-400 flex flex-col items-center">
                                            <Building2 className="w-10 h-10 stroke-[1.5]" />
                                            <span className="text-xs mt-1">Fasilitas Eduvia</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {facility.name}
                                        </h3>
                                        <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                            {facility.description || 'Fasilitas pembelajaran terstandarisasi untuk kenyamanan dan keunggulan praktikum siswa.'}
                                        </p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-medium text-emerald-600">
                                        Tersedia & Siap Digunakan
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500">
                        Belum ada fasilitas yang ditambahkan.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

