'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="max-w-xl w-full bg-red-950/30 border border-red-500/30 rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-red-400">Error en el dashboard</h2>
        <p className="text-sm text-white/60 font-mono break-words">
          {error?.message || 'Error desconocido'}
        </p>
        {error?.stack && (
          <pre className="text-xs text-white/30 overflow-auto max-h-40 bg-black/40 p-3 rounded-lg">
            {error.stack}
          </pre>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-primary/80 transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
