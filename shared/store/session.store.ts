
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

type SessionState = {
    user: User | null;
    hasHydrated: boolean;
    setUser: (user: User | null) => void;
    clearSession: () => void;
    setHasHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
    devtools(
        (set) => ({
            user: null,
            hasHydrated: false,

            setUser: (user) => set({ user }, undefined, 'session/setUser'),

            clearSession: () =>
                set({ user: null }, undefined, 'session/clear'),

            setHasHydrated: (value) =>
                set({ hasHydrated: value }, undefined, 'session/hydrated'),
        }),
        {
            name: 'SessionStore',
            enabled: process.env.NODE_ENV !== 'production',
        },
    ),
);
