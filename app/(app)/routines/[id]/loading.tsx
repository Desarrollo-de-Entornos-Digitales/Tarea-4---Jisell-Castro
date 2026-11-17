
export default function Loading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-8 w-40 rounded bg-base-300" />

            <div className="flex flex-col gap-3">
                <div className="h-8 w-64 rounded bg-base-300" />
                <div className="h-4 w-80 rounded bg-base-300" />
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body gap-4">
                    <div className="h-6 w-48 rounded bg-base-300" />

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-12 w-full rounded bg-base-300"
                        />
                    ))}
                </div>
            </div>

            <p className="text-sm opacity-70 text-center">
                Cargando rutina...
            </p>
        </div>
    );
}
