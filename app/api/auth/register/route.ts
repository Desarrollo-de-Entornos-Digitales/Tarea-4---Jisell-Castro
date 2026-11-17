
import { NextResponse } from 'next/server';
import {
    createUserId,
    hashPassword,
    readUsers,
    toPublicUser,
    writeUsers,
} from '@/shared/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username ?? '').trim();
        const email = String(body.email ?? '').trim().toLowerCase();
        const password = String(body.password ?? '');

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios' },
                { status: 400 },
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { message: 'El nombre debe tener al menos 3 caracteres' },
                { status: 400 },
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'La contraseña debe tener al menos 8 caracteres' },
                { status: 400 },
            );
        }

        const users = await readUsers();

        const existingUser = users.find(
            (user) => user.email === email,
        );

        if (existingUser) {
            return NextResponse.json(
                { message: 'Este correo ya está registrado' },
                { status: 409 },
            );
        }

        const newUser = {
            id: createUserId(),
            username,
            email,
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString(),
        };

        await writeUsers([...users, newUser]);

        return NextResponse.json(
            {
                message: 'Usuario registrado correctamente',
                user: toPublicUser(newUser),
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error en registro:', error);

        return NextResponse.json(
            { message: 'Error interno al registrar el usuario' },
            { status: 500 },
        );
    }
}
