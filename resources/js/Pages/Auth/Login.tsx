import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Silakan masuk menggunakan Email, NIP, NISN, atau Username Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700 border border-blue-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="login" value="Email / NISN / NIP / Username" />

                    <TextInput
                        id="login"
                        type="text"
                        name="login"
                        value={data.login}
                        placeholder="contoh: admin@eduvia.test atau superadmin"
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-brand-600 focus:ring-brand-500 text-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('login', e.target.value)}
                    />

                    <InputError message={errors.login} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Kata Sandi" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-brand-600 hover:text-brand-700 hover:underline"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-brand-600 focus:ring-brand-500 text-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm" disabled={processing}>
                        Masuk
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
