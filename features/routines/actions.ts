
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { routinesStore } from './store';
import { validateRoutine, type RoutineErrors } from './validation';

export interface FormState {
    errors?: RoutineErrors;
    values?: {
        name: string;
        description: string;
        level: string;
        exerciseIds: number[];
    };
}

// Crea una rutina desde el servidor
export async function createRoutineAction(
    _prev: FormState,
    formData: FormData
): Promise<FormState> {
    const values = {
        name: String(formData.get('name') ?? ''),
        description: String(formData.get('description') ?? ''),
        level: String(formData.get('level') ?? ''),
        exerciseIds: formData.getAll('exerciseIds').map(Number),
    };

    const errors = validateRoutine(values);

    if (Object.keys(errors).length > 0) {
        return { errors, values };
    }

    routinesStore.create(values);

    revalidatePath('/routines');
    redirect('/routines');
}

// Simula una base de datos lenta
const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Marca o desmarca un ejercicio como realizado
export async function toggleDoneAction(
    routineId: number,
    exerciseId: number
): Promise<void> {
    await delay(800);

    routinesStore.toggleDone(routineId, exerciseId);

    revalidatePath(`/routines/${routineId}`);
}

// Elimina una rutina
export async function deleteRoutineAction(
    formData: FormData
): Promise<void> {
    const routineId = Number(formData.get('routineId'));

    if (!Number.isInteger(routineId) || routineId <= 0) {
        return;
    }

    routinesStore.remove(routineId);

    revalidatePath('/routines');

    redirect('/routines');
}
