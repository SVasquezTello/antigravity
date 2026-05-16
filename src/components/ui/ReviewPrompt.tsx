'use client'

import { useState, useEffect } from 'react'
import { Star, X, MessageSquareHeart } from 'lucide-react'

export function ReviewPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Lógica: Mostrar solo después de que el usuario haya usado la app un poco
    // En una app real, esto se dispararía tras una acción positiva (ej: completar un análisis)
    const hasReviewed = localStorage.getItem('antigravity_reviewed')
    if (!hasReviewed) {
      const timer = setTimeout(() => setShow(true), 30000) // Mostrar tras 30 segundos de uso
      return () => clearTimeout(timer)
    }
  }, [])

  const handleReview = () => {
    localStorage.setItem('antigravity_reviewed', 'true')
    // Aquí iría el enlace a la Play Store de la app específica
    window.open('https://play.google.com/store/apps/details?id=com.antigravity.forgeai', '_blank')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 right-4 z-[99] animate-in fade-in zoom-in duration-500">
      <div className="bg-zinc-900 border border-yellow-500/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.1)] max-w-xs text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-yellow-500/20 p-3 rounded-full">
            <MessageSquareHeart className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <h4 className="text-white font-bold text-base">¿Te gusta Antigravity?</h4>
        <p className="text-zinc-400 text-xs mt-2">
          Tu opinión nos ayuda a mejorar la IA y a seguir escalando tu negocio. ¡Danos 5 estrellas!
        </p>
        <div className="flex justify-center gap-1 my-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleReview}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold py-2 rounded-xl transition-all transform hover:scale-105"
          >
            Calificar ahora
          </button>
          <button
            onClick={() => setShow(false)}
            className="text-zinc-500 hover:text-zinc-300 text-xs py-1"
          >
            Quizás más tarde
          </button>
        </div>
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-3 right-3 text-zinc-600 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
