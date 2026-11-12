import { SchoolInfo } from '@/types';
import { usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';

interface ApplicationLogoProps {
    name?: string;
    tagline?: string;
    logoUrl?: string;
    className?: string;
    hideText?: boolean;
    compact?: boolean;
}

export default function ApplicationLogo({
    name,
    tagline,
    logoUrl,
    className = '',
    hideText = false,
    compact = false,
}: ApplicationLogoProps) {
    const pageProps = usePage().props as unknown as { school?: SchoolInfo };
    const school = pageProps.school;

    const displayName = name || school?.name || 'SMK Eduvia Nusantara';
    const displayTagline = tagline || school?.tagline || 'Maju Bersama, Berakhlak Mulia';
    const displayLogo = logoUrl || school?.logo;

    return (
        <div className={`flex items-center gap-3 min-w-0 ${className}`}>
            {displayLogo ? (
                <img
                    src={displayLogo}
                    alt={displayName}
                    className={`shrink-0 object-contain rounded-xl ${
                        compact ? 'h-8 w-8 rounded-lg' : 'h-10 w-10'
                    }`}
                />
            ) : (
                <div
                    className={`shrink-0 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 ${
                        compact ? 'h-8 w-8 rounded-lg' : 'h-10 w-10'
                    }`}
                >
                    <GraduationCap className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
                </div>
            )}

            {!hideText && (
                <div className="flex flex-col min-w-0 overflow-hidden text-left">
                    <span
                        className={`font-bold tracking-tight text-slate-900 leading-snug truncate ${
                            compact ? 'text-sm' : 'text-base sm:text-lg'
                        }`}
                        title={displayName}
                    >
                        {displayName}
                    </span>
                    <span
                        className={`font-normal leading-tight mt-0.5 truncate ${
                            compact ? 'text-[11px] text-slate-400' : 'text-xs text-slate-500'
                        }`}
                        title={displayTagline}
                    >
                        {displayTagline}
                    </span>
                </div>
            )}
        </div>
    );
}
