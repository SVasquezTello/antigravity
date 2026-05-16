'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Heart, Users, 
  Mic, BookOpen, ChevronLeft, ArrowUpRight, Radio
} from 'lucide-react'
import Link from 'next/link'

export default function OprahWinfreyMasterclassPage() {
  const chapters = [
    {
      icon: Heart,
      title: 'Capítulo 1: La Empatía como Modelo de Negocio',
      time: '12 mins',
      content: 'Cómo Oprah transformó su vulnerabilidad personal y su dura historia de vida en el activo más poderoso de su marca. En los medios, la conexión emocional genera una lealtad que el marketing tradicional jamás podrá comprar.'
    },
    {
      icon: Users,
      title: 'Capítulo 2: El "Efecto Oprah" (Kingmaker)',
      time: '16 mins',
      content: 'El poder de la curaduría. Cómo su Club de Lectura (fundado en 1996) tiene la capacidad de convertir cualquier libro en un Best Seller mundial instantáneo. Construir autoridad masiva al elevar el trabajo de otros.'
    },
    {
      icon: BookOpen,
      title: 'Capítulo 3: Inteligencia Emocional y Despertar',
      time: '18 mins',
      content: 'El análisis de su biblioteca personal (Eckhart Tolle, Miguel Ruiz, Gary Zukav). Cómo los líderes mediáticos más grandes del mundo basan sus decisiones en el principio de "Intención" y la eliminación del ego.'
    },
    {
      icon: Radio,
      title: 'Capítulo 4: Dueña de tu Propia Audiencia',
      time: '20 mins',
      content: 'El salto de ser una presentadora contratada a ser dueña de su propia red (OWN - Oprah Winfrey Network). La importancia de poseer los derechos, la distribución y el acceso directo a tu comunidad.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Mic className="w-4 h-4" /> Medios y Marca Personal
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Imperio Oprah: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 italic">Vulnerabilidad, Audiencia y el "Efecto Kingmaker"</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Cómo una mujer nacida en la pobreza extrema en Mississippi construyó un imperio mediático multimillonario basado en la empatía pura, la curaduría literaria y la conexión espiritual profunda con millones de personas.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-purple-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1598555231223-f2220f81d114?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Media / Broadcasting" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-purple-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Medios</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Poder de la Intención</h3>
            <p className="text-white/60 mb-8">
              Oprah transformó por completo la forma en que consumimos televisión cuando descubrió "El Principio de la Intención" (del libro El Asiento del Alma). Decidió que su programa ya no sería televisión basura para ganar rating, sino una plataforma intencional para elevar la consciencia del espectador. **Esa decisión fue lo que la convirtió en multimillonaria.** En lugar de competir por atención barata, creó un monopolio de atención profunda.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-purple-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-purple-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-purple-500/20 bg-gradient-to-b from-purple-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-purple-400">Recursos de Comunidad</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz del "Efecto Oprah" (Curaduría)',
                'Auditor de Intención de Marca',
                'Protocolo de Vulnerabilidad Estratégica',
                'Framework de Propiedad de Audiencia'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/oprah-media-ai" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Auditor de Marca Emocional
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Ley de Causa y Efecto</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Toda acción tiene una reacción igual y opuesta. Lo que envías hacia el mundo, es exactamente lo que terminarás recibiendo." - Karma mediático de Oprah.</p>
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
