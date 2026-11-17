
import 'server-only';

import {
    createHmac,
    randomBytes,
    randomUUID,
    scryptSync,
    timingSafeEqual,
} from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Estructura de un usuario almacenado localmente.
export interface LocalUser {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

// Información del usuario que sí podemos devolver al frontend.
export interface PublicUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIRECTORY, 'users.json');

const SESSION_DURATION = 7 * 24 * 60 * 60;

// Obtiene la clave secreta del archivo .env.local.
function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error(
            'SESSION_SECRET no está configurada correctamente en .env.local',
        );
    }

    return secret;
}

// Lee los usuarios del archivo JSON.
export async function readUsers(): Promise<LocalUser[]> {
    await mkdir(DATA_DIRECTORY, { recursive: true });

    try {
        const content = await readFile(USERS_FILE, 'utf-8');
        return JSON.parse(content) as LocalUser[];
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'ENOENT'
        ) {
            await writeFile(USERS_FILE, '[]', 'utf-8');
            return [];
        }

        throw error;
    }
}

// Guarda los usuarios en el archivo JSON.
export async function writeUsers(users: LocalUser[]): Promise<void> {
    await mkdir(DATA_DIRECTORY, { recursive: true });

    await writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2),
        'utf-8',
    );
}

// Genera un hash seguro de la contraseña.
export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');

    return `${salt}:${hash}`;
}

// Comprueba si una contraseña coincide con su hash.
export function verifyPassword(
    password: string,
    storedHash: string,
): boolean {
    const [salt, originalHash] = storedHash.split(':');

    if (!salt || !originalHash) {
        return false;
    }

    const hashBuffer = Buffer.from(originalHash, 'hex');
    const passwordBuffer = scryptSync(password, salt, 64);

    if (hashBuffer.length !== passwordBuffer.length) {
        return false;
    }

    return timingSafeEqual(hashBuffer, passwordBuffer);
}

// Convierte un usuario privado en información pública.
export function toPublicUser(user: LocalUser): PublicUser {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    };
}

// Crea una sesión firmada para el usuario.
export function createSessionToken(userId: string): string {
    const payload = {
        userId,
        expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    };

    const encodedPayload = Buffer.from(
        JSON.stringify(payload),
    ).toString('base64url');

    const signature = createHmac('sha256', getSessionSecret())
        .update(encodedPayload)
        .digest('base64url');

    return `${encodedPayload}.${signature}`;
}

// Comprueba que la sesión sea válida y no haya expirado.
export function verifySessionToken(token: string): string | null {
    try {
        const [encodedPayload, signature] = token.split('.');

        if (!encodedPayload || !signature) {
            return null;
        }

        const expectedSignature = createHmac(
            'sha256',
            getSessionSecret(),
        )
            .update(encodedPayload)
            .digest();

        const receivedSignature = Buffer.from(signature, 'base64url');

        if (
            receivedSignature.length !== expectedSignature.length ||
            !timingSafeEqual(receivedSignature, expectedSignature)
        ) {
            return null;
        }

        const payload = JSON.parse(
            Buffer.from(encodedPayload, 'base64url').toString('utf-8'),
        ) as {
            userId?: string;
            expiresAt?: number;
        };

        if (
            typeof payload.userId !== 'string' ||
            typeof payload.expiresAt !== 'number' ||
            payload.expiresAt <= Math.floor(Date.now() / 1000)
        ) {
            return null;
        }

        return payload.userId;
    } catch {
        return null;
    }
}

// Genera un identificador único para cada usuario.
export function createUserId(): string {
    return randomUUID();
}
