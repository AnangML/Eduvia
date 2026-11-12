import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="w-full overflow-hidden bg-white px-6 py-8 shadow-sm border border-slate-200/80 rounded-2xl sm:max-w-md">
                {children}
            </div>

            <div className="mt-8 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Eduvia. All rights reserved.
            </div>
        </div>
    );
}
