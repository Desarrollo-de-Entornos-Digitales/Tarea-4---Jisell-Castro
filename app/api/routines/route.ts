
import { NextResponse } from 'next/server';
import { routinesStore } from '@/features/routines/store';
import { LEVELS } from '@/features/routines/types';

// GET /api/routines
// GET /api/routines?level=intermedio

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const level = searchParams.get('level');

    const routines = routinesStore.list();

    if (!level) {
        return NextResponse.json(routines);
    }

    const validLevel = LEVELS.some(
        (item) => item.value === level
    );

    if (!validLevel) {
        return NextResponse.json(
            { error: 'Nivel no válido. Usa principiante, intermedio o avanzado.' },
            { status: 400 }
        );
    }

    const filteredRoutines = routines.filter(
        (routine) => routine.level === level
    );

    return NextResponse.json(filteredRoutines);
}

// POST /api/routines
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    const input = {
        name: String(body?.name ?? ''),
        description: String(body?.description ?? ''),
        level: String(body?.level ?? ''),
        exerciseIds: Array.isArray(body?.exerciseIds)
            ? body.exerciseIds.map(Number)
            : [],
    };

    const { validateRoutine } = await import(
        '@/features/routines/validation'
    );

    const errors = validateRoutine(input);

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json(
        routinesStore.create(input),
        { status: 201 }
    );
}
