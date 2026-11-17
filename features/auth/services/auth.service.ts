
import { useNotificationsStore } from '@/features/notifications/store/notifications.store';
import {
    LoginCredentials,
    RegisterData,
    User,
} from '../types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<User> {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al iniciar sesión');
        }

        useNotificationsStore
            .getState()
            .addNotification('Inicio de sesión exitoso');

        return result.user as User;
    },

    async register(data: RegisterData): Promise<User> {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al registrar la cuenta');
        }

        return result.user as User;
    },

    async logout(): Promise<void> {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('No se pudo cerrar la sesión');
        }

        useNotificationsStore
            .getState()
            .addNotification('Sesión cerrada');
    },
};