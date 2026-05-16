'use client'

import { Check, Zap } from 'lucide-react'

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  isPopular?: boolean
  appName: string
}

export function PricingCard({ title, price, features, isPopular, appName }: PricingCardProps) {
  const handleSubscribe = () => {
    // Aquí se dispara el flujo de Google Play Billing
    console.log(`Iniciando suscripción para ${appName} - ${title}`)
    if (typeof window !== 'undefined' && (window as any).Android) {
      // Llamada al bridge nativo si existe
      (window as any).Android.launchBillingFlow(title);
    } else {
      alert('Redirigiendo a pasarela de pago segura...');
    }
  }

  return (
    <div className={`relative p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
      isPopular ? 'bg-primary/10 border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]' : 'bg-zinc-900/50 border-zinc-800'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" /> Recomendado
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-black text-white">{price}</span>
        <span className="text-zinc-500 text-sm">/mes</span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
            <Check className="w-5 h-5 text-primary shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          isPopular ? 'bg-primary hover:bg-primary/80 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
        }`}
      >
        Empezar Ahora
      </button>
    </div>
  )
}
