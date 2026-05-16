'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Gem, Scale, 
  Eye, TrendingUp, ChevronLeft, ArrowUpRight, Crown
} from 'lucide-react'
import Link from 'next/link'

export default function BernardArnaultMasterclassPage() {
  const chapters = [
    {
      icon: Crown,
      title: 'Capítulo 1: El "Lobo en Cachemira"',
      time: '12 mins',
      content: 'Cómo Bernard Arnault construyó LVMH a través de adquisiciones hostiles y calculadas. La lección de no crear desde cero cuando puedes comprar, optimizar y monopolizar un mercado (más de 70 marcas de lujo bajo un solo techo).'
    },
    {
      icon: Scale,
      title: 'Capítulo 2: La Paradoja de la "Marca Estrella"',
      time: '18 mins',
      content: 'Para que un negocio sobreviva siglos, debe cumplir una paradoja: Ser Atemporal (respetar la historia y calidad de origen) y ser Moderno (marcar la vanguardia de las nuevas tendencias). Si eres solo uno de los dos, tu marca morirá.'
    },
    {
      icon: TrendingUp,
      title: 'Capítulo 3: La Regla del 15 / 85 (Innovación sin Riesgo)',
      time: '15 mins',
      content: 'Por qué LVMH no arriesga su futuro en cada lanzamiento. Dedican el 15% del negocio a innovación radical (piezas carísimas y limitadas que generan hype) y el 85% a sus productos clásicos que garantizan el flujo de caja. El "hype" vende los clásicos.'
    },
    {
      icon: Eye,
      title: 'Capítulo 4: El Crecimiento es una Función del "Deseo"',
      time: '20 mins',
      content: 'El lujo no se vende con publicidad lógica ni con descuentos. Se vende creando "Deseabilidad" irracional. Si la gente desea tu producto, serás invulnerable a las crisis económicas y a la inflación.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Gem className="w-4 h-4" /> Lujo y Deseabilidad
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Imperio LVMH: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 italic">La Ingeniería del Deseo y la Exclusividad</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Cómo Bernard Arnault, un ingeniero civil convertido en "El Papa de la Moda", construyó el conglomerado de lujo más grande del mundo (Louis Vuitton, Dior, Moët) monopolizando la deseabilidad irracional.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-amber-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Luxury / High Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center backdrop-blur-xl border border-amber-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Lujo</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Framework de la Innovación Limitada</h3>
            <p className="text-white/60 mb-8">
              La estrategia de LVMH para dominar el mercado es contraintuitiva. Lanzan un bolso extremadamente raro y costoso (ej: $8,000 USD). Fabrican muy pocas unidades para garantizar que se agote. Este bolso genera portadas de revistas y "Hype". Ese hype atrae a millones a la tienda, quienes al no poder pagar el bolso de $8,000, terminan comprando cinturones, perfumes o bolsos clásicos que financian el 85% de las utilidades de la compañía. El lujo es vender el sueño.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-amber-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-amber-500/20 bg-gradient-to-b from-amber-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-amber-400">Recursos de Exclusividad</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de "Deseabilidad" Irracional',
                'Protocolo de Innovación 15/85',
                'Estructura de la Paradoja Atemporal',
                'Guía de Control de Escasez'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/arnault-luxury-ai" className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Arquitecto de Lujo y Deseo
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de la Demanda</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"El crecimiento de una empresa no se trata de volumen de ventas, es una función matemática de Alto Deseo. Si desean tu producto, el precio deja de importar."</p>
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
