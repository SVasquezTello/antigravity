'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, BookOpen, Target, CheckCircle2, 
  Search, Palette, Video, BarChart3, ChevronLeft, Lock
} from 'lucide-react'
import Link from 'next/link'

export default function TilburyCoursePage() {
  const steps = [
    {
      icon: Search,
      title: 'Paso 1: El Método "Dummy Scroll"',
      time: '15 mins',
      content: 'Crea una cuenta nueva en Instagram. Haz scroll interactuando ÚNICAMENTE con anuncios de dropshipping. Esto entrenará al algoritmo para mostrarte productos ganadores al instante. Luego, usa ChatGPT (o nuestra app CopyKiller) para seleccionar el nicho más rentable basado en tu lista.'
    },
    {
      icon: Palette,
      title: 'Paso 2: Tienda IA en Minutos',
      time: '30 mins',
      content: 'Aprovecha la IA para generar el diseño base de tu tienda. Usa generadores de nombres (ej. ThrivingPaws.store) y crea un logo minimalista con IA (Midjourney/Nanobanana). El objetivo no es ser perfecto, sino parecer confiable en menos de 3 segundos.'
    },
    {
      icon: Target,
      title: 'Paso 3: Catálogo con AutoDS',
      time: '20 mins',
      content: 'Conecta herramientas de automatización como AutoDS a Shopify. Importa productos en tendencia (ej. limpiador de patas de perro). Lo más importante: reescribe los títulos y descripciones aburridas de los proveedores usando nuestra app SEO Pro E-com.'
    },
    {
      icon: Video,
      title: 'Paso 4: Anuncios UGC con IA',
      time: '45 mins',
      content: 'No tienes que grabar tú mismo. Usa herramientas de IA generativa (o nuestra app ViralAd Scripts) para crear guiones que enganchen en los primeros 3 segundos, y usa avatares realistas para crear anuncios tipo UGC (User Generated Content) que generan confianza.'
    },
    {
      icon: BarChart3,
      title: 'Paso 5: Lanzamiento y Optimización',
      time: '1-3 días',
      content: 'Lanza campañas de prueba en Meta Ads (Facebook/Instagram) con presupuesto bajo ($20 al día). Apaga los anuncios que no convierten rápido y escala los ganadores. Deja que las herramientas de automatización procesen los pedidos mientras tú te enfocas en marketing.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <BookOpen className="w-4 h-4" /> Academia Premium
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 italic">Tilbury</span> de 7 Días
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Aprende el sistema exacto para construir y escalar una tienda de Dropshipping automatizada usando Inteligencia Artificial, sin tocar inventario.
        </p>
      </header>

      {/* Video Placeholder / Header Image */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-green-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Course Cover" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center backdrop-blur-xl border border-green-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Ver Masterclass</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">Módulos del Curso</h3>
            <p className="text-white/60 mb-8">
              En este curso express, desglosamos el exitoso reto de Mark Tilbury. Verás paso a paso cómo iniciar desde cero con solo $250 de presupuesto.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-green-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                  <step.icon className="w-6 h-6 text-white/40 group-hover:text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{step.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{step.time}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.content}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-green-500/20 bg-gradient-to-b from-green-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-green-500">Recursos Incluidos</h4>
            
            <ul className="space-y-4">
              {[
                'Plantilla de Prompts Tilbury',
                'Listado de Nichos 2026',
                'Checklist de Tienda de Alta Conversión',
                'Estructura de Guiones Virales'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/drop-tilbury-method" className="w-full py-4 bg-green-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 mt-6">
               <Target className="w-4 h-4" /> Ir al Simulador IA
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Módulo Avanzado</h4>
                <Lock className="w-4 h-4 text-white/40" />
             </div>
             <p className="text-xs text-white/40 leading-relaxed">Escalado a $100k al mes. Se desbloquea al lograr tu primera venta.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
