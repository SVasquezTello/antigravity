'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, RefreshCw, GitMerge, 
  MapPin, Clock, ChevronLeft, ArrowUpRight, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function AmancioOrtegaMasterclassPage() {
  const chapters = [
    {
      icon: Clock,
      title: 'Capítulo 1: La Velocidad lo es Todo',
      time: '14 mins',
      content: 'El concepto de "Fast Fashion". Por qué tener una producción ligeramente más cara en Europa pero que tarde 2 semanas en llegar a la tienda es infinitamente mejor que producir barato en Asia y tardar 3 meses.'
    },
    {
      icon: GitMerge,
      title: 'Capítulo 2: Integración Vertical',
      time: '18 mins',
      content: 'El secreto del control absoluto. Zara domina el Diseño, Fabricación, Logística y Venta. Al no depender de intermediarios, pueden detectar una tendencia hoy y tenerla en los percheros globales en 14 días.'
    },
    {
      icon: TrendingUp,
      title: 'Capítulo 3: Escuchar a la Calle (No a las Pasarelas)',
      time: '15 mins',
      content: 'Zara no dicta la moda, la responde. Los gerentes de tienda y los diseñadores reportan diariamente qué quiere la gente. Es un modelo basado 100% en la "Demanda del Consumidor" en tiempo real.'
    },
    {
      icon: MapPin,
      title: 'Capítulo 4: El Inmueble es el Marketing',
      time: '20 mins',
      content: 'Inditex invierte cero euros en anuncios de televisión. Su presupuesto de marketing se destina íntegramente a comprar y alquilar las esquinas más caras y transitadas del mundo (Prime Real Estate) como su único escaparate.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <RefreshCw className="w-4 h-4" /> Operaciones y Retail
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Sistema Inditex: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 italic">Integración Vertical y Agilidad Extrema</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Cómo Amancio Ortega convirtió un taller de batas de baño en un imperio global de 100,000 millones de euros. Descubre el modelo operativo más estudiado en las escuelas de negocios del mundo.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-orange-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Retail / Fashion Store" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center backdrop-blur-xl border border-orange-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-orange-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Masterclass Operativa</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Inventario es tu Enemigo</h3>
            <p className="text-white/60 mb-8">
              En el modelo tradicional de negocios, tener mercancía almacenada por meses en un barco o en un almacén destruye el flujo de caja. La magia de Zara radica en su **obsesión por el ciclo de producto**. Cambiar el catálogo cada 2 semanas fuerza la escasez, acelera la compra y garantiza que el negocio siempre esté cobrando en lugar de almacenando.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-orange-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-orange-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-orange-500/20 bg-gradient-to-b from-orange-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-orange-400">Recursos de Operaciones</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Integración Vertical',
                'Simulador de Ciclo de Producto (14 Días)',
                'Auditoría de Cuellos de Botella',
                'Estrategia de Ubicación (Real Estate)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/ortega-supply-ai" className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Auditor de Integración Vertical
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de Velocidad</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Lo que gusta mucho en Nueva York puede no venderse en París. Si descubres una tendencia hoy, debes tenerla fabricada y en el mostrador en menos de 3 semanas."</p>
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
