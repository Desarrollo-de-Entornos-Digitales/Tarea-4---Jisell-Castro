
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/shared/store/session.store';
import type { User } from '../types';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const user = useSessionStore((state) => state.user);
    const hasHydrated = useSessionStore((state) => state.hasHydrated);
    const setUser = useSessionStore((state) => state.setUser);
    const setHasHydrated = useSessionStore(
        (state) => state.setHasHydrated,
    );

    useEffect(() => {
        let active = true;

        async function verifySession() {
            try {
                const response = await fetch('/api/auth/me', {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (!response.ok) {
                    if (active) {
                        setUser(null);
                    }
                    return;
                }

                const result = await response.json();

                if (active) {
                    setUser(result.user as User);
                }
            } catch (error) {
                console.error('Error verificando la sesión:', error);

                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setHasHydrated(true);
                }
            }
        }

        verifySession();

        return () => {
            active = false;
        };
    }, [setUser, setHasHydrated]);

    useEffect(() => {
        if (hasHydrated && !user) {
            router.replace('/login');
        }
    }, [hasHydrated, user, router]);

    if (!hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center gap-3">
                <span className="loading loading-spinner text-primary"></span>
                <span>Verificando autorización de acceso...</span>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
    