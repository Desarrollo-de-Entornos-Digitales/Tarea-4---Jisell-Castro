
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    readUsers,
    verifySessionToken,
    toPublicUser,
} from '@/shared/lib/auth';

const SESSION_COOKIE = 'pawlife_session';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

        if (!sessionToken) {
            return NextResponse.json(
                { user: null },
                { status: 401 },
            );
        }

        const userId = verifySessionToken(sessionToken);

        if (!userId) {
            return NextResponse.json(
                { user: null },
                { status: 401 },
            );
        }

        const users = await readUsers();
        const user = users.find((item) => item.id === userId);

        if (!user) {
            return NextResponse.json(
                { user: null },
                { status: 401 },
            );
        }

        return NextResponse.json({
            user: toPublicUser(user),
        });
    } catch (error) {
        console.error('Error al consultar la sesión:', error);

        return NextResponse.json(
            { message: 'Error al consultar la sesión' },
            { status: 500 },
        );
    }
}
