
import type { Routine } from './types';

const API_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getRoutines(): Promise<Routine[]> {
    const response = await fetch(`${API_URL}/api/routines`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('No se pudieron obtener las rutinas');
    }

    return response.json();
}

export async function getRoutine(
    id: number
): Promise<Routine | null> {
    const response = await fetch(`${API_URL}/api/routines/${id}`, {
        cache: 'no-store',
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('No se pudo obtener la rutina');
    }

    return response.json();
}
