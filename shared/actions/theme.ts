
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const THEMES = ['icesi', 'icesi-dark', 'icesi-contraste'];

// Alterna entre los tres temas y guarda la selección en una cookie
export async function toggleThemeAction(): Promise<void> {
    const store = await cookies();

    const currentTheme = store.get('theme')?.value ?? 'icesi';

    const currentIndex = THEMES.indexOf(currentTheme);

    const nextIndex = (currentIndex + 1) % THEMES.length;

    const nextTheme = THEMES[nextIndex];

    store.set('theme', nextTheme, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    });

    revalidatePath('/', 'layout');
}
