'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ background: '#000', color: '#fff', fontFamily: 'monospace', padding: '2rem' }}>
        <h2 style={{ color: '#f87171' }}>Error Global</h2>
        <p style={{ color: '#94a3b8', wordBreak: 'break-all' }}>{error?.message}</p>
        <pre style={{ color: '#64748b', fontSize: '11px', overflow: 'auto', maxHeight: '200px' }}>{error?.stack}</pre>
        <button onClick={reset} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginTop: '16px' }}>
          Reintentar
        </button>
      </body>
    </html>
  )
}
