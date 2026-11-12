import { SVGAttributes } from 'react';

export default function ApplicationLogo({ className = 'h-10 w-auto', ...props }: SVGAttributes<SVGElement>) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-500/30">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    {...props}
                >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                    Eduvia
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                    Integrated School
                </span>
            </div>
        </div>
    );
}
