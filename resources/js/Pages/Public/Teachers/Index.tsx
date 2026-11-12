import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { GraduationCap, Mail, Phone, User } from 'lucide-react';

interface TeacherItem {
    id: number;
    name: string;
    title_degree: string | null;
    gender: string;
    photo: string | null;
    employment_status: string;
    current_homeroom_classroom?: {
        name: string;
    } | null;
}

interface TeachersProps {
    profile: {
        school_name: string;
        school_tagline: string;
    };
    teachers: {
        data: TeacherItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        last_page: number;
    };
}

export default function TeachersIndex({ profile, teachers }: TeachersProps) {
    return (
        <PublicLayout
            title="Direktori Tenaga Pendidik"
            description={`Profil dewan guru dan tenaga kependidikan berdedikasi di ${profile.school_name}.`}
            profile={{ school_name: profile.school_name, school_tagline: profile.school_tagline }}
        >
            <div className="bg-gradient-to-b from-blue-50/60 to-white py-14 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Dewan Guru & Pendidik
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Tenaga Pendidik Berdedikasi
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
                        Membimbing dengan keahlian, pengalaman profesional, dan ketulusan hati.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {teachers.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {teachers.data.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="group rounded-2xl bg-white border border-slate-200/80 p-5 hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between"
                            >
                                <div className="space-y-4 flex flex-col items-center w-full">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-blue-100 flex items-center justify-center overflow-hidden">
                                        {teacher.photo ? (
                                            <img
                                                src={teacher.photo}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-slate-400 stroke-[1.5]" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                                            {teacher.name}
                                        </h3>
                                        {teacher.title_degree && (
                                            <p className="text-xs text-blue-600 font-medium mt-0.5">
                                                {teacher.title_degree}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full pt-4 mt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 font-normal">
                                    {teacher.current_homeroom_classroom ? (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            <span>Wali Kelas {teacher.current_homeroom_classroom.name}</span>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 text-[11px]">
                                            Guru Pengampu Mapel
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500">
                        Belum ada data guru yang ditampilkan di publik. Anda dapat mengaktifkannya melalui panel Admin CMS / Data Guru.
                    </div>
                )}

                {/* Pagination */}
                {teachers.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1.5 pt-6">
                        {teachers.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

