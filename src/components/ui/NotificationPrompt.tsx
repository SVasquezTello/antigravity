'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export function NotificationPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Solo mostrar si no ha dado permiso o denegado
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => setShow(true), 5000) // Mostrar tras 5 segundos
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Permiso de notificaciones concedido')
      // Aquí podrías enviar el token al backend (Firebase/Supabase)
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-zinc-900/90 backdrop-blur-md border border-primary/20 p-4 rounded-2xl shadow-2xl max-w-sm flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Bell className="w-6 h-6 text-primary animate-bounce" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">¿Quieres alertas de ROI?</h4>
          <p className="text-zinc-400 text-xs mt-1">
            Recibe notificaciones críticas de la IA sobre tu negocio en tiempo real.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={requestPermission}
              className="bg-primary hover:bg-primary/80 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Activar
            </button>
            <button
              onClick={() => setShow(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="text-zinc-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
