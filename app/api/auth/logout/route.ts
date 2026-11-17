
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'pawlife_session';

export async function POST() {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return NextResponse.json({
        message: 'Sesión cerrada correctamente',
    });
}
