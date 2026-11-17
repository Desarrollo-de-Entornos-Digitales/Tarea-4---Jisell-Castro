
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    readUsers,
    verifyPassword,
    createSessionToken,
    toPublicUser,
} from '@/shared/lib/auth';

const SESSION_COOKIE = 'pawlife_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const email = String(body.email ?? '').trim().toLowerCase();
        const password = String(body.password ?? '');

        if (!email || !password) {
            return NextResponse.json(
                { message: 'El correo y la contraseña son obligatorios' },
                { status: 400 },
            );
        }

        const users = await readUsers();

        const user = users.find((item) => item.email === email);

        if (!user || !verifyPassword(password, user.passwordHash)) {
            return NextResponse.json(
                { message: 'Correo o contraseña incorrectos' },
                { status: 401 },
            );
        }

        const sessionToken = createSessionToken(user.id);

        const cookieStore = await cookies();

        cookieStore.set(SESSION_COOKIE, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        });

        return NextResponse.json(
            {
                message: 'Inicio de sesión exitoso',
                user: toPublicUser(user),
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error en inicio de sesión:', error);

        return NextResponse.json(
            { message: 'Error interno al iniciar sesión' },
            { status: 500 },
        );
    }
}
