'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, LineChart, Building2, 
  Wallet, ShieldAlert, ChevronLeft, ArrowUpRight, Signal
} from 'lucide-react'
import Link from 'next/link'

export default function CarlosSlimMasterclassPage() {
  const chapters = [
    {
      icon: Wallet,
      title: 'Capítulo 1: La Libreta de Cuentas',
      time: '12 mins',
      content: 'A los 7 años, Carlos Slim recibía dulces al por mayor para venderlos al por menor, y llevaba un registro milimétrico de ingresos y gastos en una libreta regalada por su padre. La importancia del flujo de caja desde la infancia.'
    },
    {
      icon: ShieldAlert,
      title: 'Capítulo 2: Invertir en Medio del Pánico',
      time: '18 mins',
      content: 'Durante la brutal crisis mexicana de 1982, mientras todos huían del país y vendían barato, Slim hizo lo contrario. Aplicó la filosofía de su padre (quien invirtió durante la Revolución) y compró empresas a centavos por dólar.'
    },
    {
      icon: Building2,
      title: 'Capítulo 3: Comprar la Quiebra, Vender la Optimización',
      time: '15 mins',
      content: 'El modelo Slim: Comprar empresas en problemas de liquidez (Cigatam, Jarritos, Sanborns), aplicar su tesis de ingeniería civil sobre "optimización lineal de recursos" y volverlas rentables eliminando la grasa operativa.'
    },
    {
      icon: Signal,
      title: 'Capítulo 4: El Invento del Prepago (Telcel)',
      time: '20 mins',
      content: 'Cómo democratizó la telefonía celular en el mundo. En lugar de vender planes mensuales caros, inventó las tarjetas de prepago para que el aire celular se vendiera como si fueran dulces. En telecomunicaciones, el volumen es mejor que el precio.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <LineChart className="w-4 h-4" /> Finanzas y Escalamiento
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Método Slim: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic">Crisis, Flujo y Mercados Masivos</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          La ingeniería civil aplicada al mundo de los negocios. Descubre cómo Carlos Slim amasó una de las fortunas más grandes del planeta comprando empresas en quiebra y democratizando la tecnología mediante modelos de prepago.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-emerald-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Stock Market / Finance" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-xl border border-emerald-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis Financiero</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">Hacer lo Contrario a la Masa</h3>
            <p className="text-white/60 mb-8">
              En las crisis profundas, la histeria domina los mercados. El éxito de Carlos Slim radica en la frialdad de los números. Cuando México entró en *default* en 1982, él entendió que las empresas no perdían su valor intrínseco, solo perdían su valor especulativo. **"Siempre es un buen momento para creer e invertir en el país".**
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-emerald-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{chapter.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{chapter.time}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {chapter.content}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-emerald-500/20 bg-gradient-to-b from-emerald-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400">Recursos de Optimización</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de "Prepago" (Volumen vs Precio)',
                'Plantilla de Optimización Lineal',
                'Guía de Compras en Crisis',
                'Estructura de Flujo Efectivo (Cash Cow)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/slim-crisis-ai" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Estratega de Mercado Masivo
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla del Volumen</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"En las telecomunicaciones y en los servicios masivos, el volumen siempre será más importante que el precio. Hazlo tan fácil de comprar como un dulce."</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
