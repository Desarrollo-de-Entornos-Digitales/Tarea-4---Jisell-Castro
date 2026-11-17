
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useSessionStore } from '@/shared/store/session.store';
import { toggleThemeAction } from '@/shared/actions/theme';

export default function AppLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const clearSession = useSessionStore((state) => state.clearSession);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await authService.logout();
            clearSession();
            router.replace('/login');
            router.refresh();
        } catch (error) {
            console.error('Error cerrando sesión:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-base-200">
                <header className="navbar bg-base-100 shadow-sm px-6 justify-between border-b border-base-300">
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className={`btn btn-ghost btn-sm ${pathname === '/dashboard' ? 'btn-active font-bold' : ''}`}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/exercises"
                            className={`btn btn-ghost btn-sm ${pathname.startsWith('/exercises') ? 'btn-active font-bold' : ''}`}
                        >
                            Ejercicios
                        </Link>

                        <Link
                            href="/routines"
                            className={`btn btn-ghost btn-sm ${pathname.startsWith('/routines') ? 'btn-active font-bold' : ''}`}
                        >
                            Rutinas
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <NotificationBell />

                        <form action={toggleThemeAction}>
                            <button
                                type="submit"
                                className="btn btn-ghost btn-sm"
                            >
                                Cambiar tema
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="btn btn-outline btn-error btn-sm"
                        >
                            {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                        </button>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-6">
                    {children}
                </main>

                {modal}
            </div>
        </AuthGuard>
    );
}
