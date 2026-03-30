'use client'

import * as React from 'react'

type ToastType = 'success' | 'error' | 'info'
type ToastMessage = { id: string; title: string; type: ToastType }
type ToastArgs = { title: string; type: ToastType }

interface ToastContextProps {
  toast: (args: ToastArgs) => void
}

const ToastContext = React.createContext<ToastContextProps | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const toast = React.useCallback(({ title, type }: ToastArgs) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`p-4 rounded-xl shadow-lg border backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-right fade-in ${
            t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 
            t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
            'bg-white/5 border-white/10 text-white'
          }`}>
            <span>{t.title}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
