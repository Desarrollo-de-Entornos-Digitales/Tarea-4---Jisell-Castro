
'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../types';

// Componente principal
export function ExerciseFilters() {
    const searchParams = useSearchParams();
    const urlText = searchParams.get('q') ?? '';

    // Reinicia el formulario cuando cambia la búsqueda en la URL.
    return (
        <ExerciseFiltersContent
            key={urlText}
            initialText={urlText}
        />
    );
}

// Componente que contiene los filtros
function ExerciseFiltersContent({
    initialText,
}: {
    initialText: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState(initialText);

    const category = searchParams.get('category') ?? '';
    const duration = searchParams.get('duration') ?? '';
    const urlText = searchParams.get('q') ?? '';
    const paramsString = searchParams.toString();

    // Actualiza un parámetro y conserva los demás.
    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const query = params.toString();

        startTransition(() => {
            router.push(query ? `${pathname}?${query}` : pathname);
        });
    };

    // Espera 300 ms después de escribir para buscar.
    useEffect(() => {
        if (text === urlText) return;

        const timer = setTimeout(() => {
            const params = new URLSearchParams(paramsString);

            if (text.trim()) {
                params.set('q', text);
            } else {
                params.delete('q');
            }

            const query = params.toString();

            router.push(query ? `${pathname}?${query}` : pathname);
        }, 300);

        return () => clearTimeout(timer);
    }, [text, urlText, paramsString, pathname, router]);

    return (
        <div className="flex flex-col gap-4">

            {/* Búsqueda */}
            <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-xs">
                <span className="sr-only">Buscar ejercicio</span>

                <input
                    type="search"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Buscar ejercicio o músculo"
                    className="grow"
                />

                {isPending && (
                    <span className="loading loading-spinner loading-xs" />
                )}
            </label>

            {/* Filtro por categoría */}
            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar por categoría"
            >
                <button
                    type="button"
                    onClick={() => updateParam('category', '')}
                    className={`btn btn-sm ${category === '' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Todos
                </button>

                {CATEGORIES.map((c) => (
                    <button
                        key={c.value}
                        type="button"
                        onClick={() => updateParam('category', c.value)}
                        className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-outline'}`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Filtro por duración */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Duración:</span>

                <button
                    type="button"
                    onClick={() => updateParam('duration', '')}
                    className={`btn btn-sm ${duration === '' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Todas
                </button>

                <button
                    type="button"
                    onClick={() => updateParam('duration', '5')}
                    className={`btn btn-sm ${duration === '5' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Hasta 5 minutos
                </button>

                <button
                    type="button"
                    onClick={() => updateParam('duration', '10')}
                    className={`btn btn-sm ${duration === '10' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Hasta 10 minutos
                </button>
            </div>
        </div>
    );
}
