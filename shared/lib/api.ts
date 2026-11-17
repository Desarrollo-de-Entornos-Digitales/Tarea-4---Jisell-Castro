
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

function getHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
    };
}

export const api = {
    // GET: consulta y retorna el JSON tipado
    async get<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status}: no se pudo cargar la información`);
        }

        return res.json();
    },

    // POST: envía body y retorna el JSON tipado
    async post<T>(endpoint: string, body: unknown): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            const msg = Array.isArray(data.message) ? data.message[0] : data.message;
            throw new Error(msg || 'Error al procesar la solicitud');
        }

        return res.json();
    },
};
