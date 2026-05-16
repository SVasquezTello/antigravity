'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Apple, Smartphone, 
  Palette, Focus, ChevronLeft, ArrowUpRight, Zap
} from 'lucide-react'
import Link from 'next/link'

export default function SteveJobsMasterclassPage() {
  const chapters = [
    {
      icon: Palette,
      title: 'Capítulo 1: La Belleza de lo Invisible',
      time: '14 mins',
      content: 'Cómo la lección de su padre adoptivo (un mecánico) moldeó a Apple: "La parte trasera del armario debe ser tan hermosa como la delantera". El origen de la obsesión por el diseño, el empaque y la experiencia de usuario.'
    },
    {
      icon: Zap,
      title: 'Capítulo 2: El Campo de Distorsión de la Realidad',
      time: '18 mins',
      content: 'Jobs exigía lo imposible a sus ingenieros y, sorprendentemente, lo lograban. Análisis de su estilo de liderazgo tiránico pero profundamente inspirador, capaz de sacar lo mejor (y lo peor) de su equipo.'
    },
    {
      icon: Focus,
      title: 'Capítulo 3: El Poder del Foco (La Matriz de 4 Cuadrantes)',
      time: '15 mins',
      content: 'A su regreso a Apple en 1997, la empresa estaba al borde de la quiebra. Jobs eliminó el 70% de los productos y enfocó toda la compañía en solo 4 computadoras. Aprende a decir "NO" a las distracciones.'
    },
    {
      icon: Smartphone,
      title: 'Capítulo 4: La Intersección entre Arte y Tecnología',
      time: '20 mins',
      content: 'El iPod, iTunes, iPhone y iPad. Cómo Jobs no inventaba mercados (ya existían mp3 y teléfonos), pero los revolucionaba integrando hardware, software y humanidades en una sola experiencia fluida.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Apple className="w-4 h-4" /> Producto y Diseño
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Estándar Jobs: <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500 italic">Arte, Foco y Perfección</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Una inmersión en la biografía oficial de Walter Isaacson. Descubre cómo Steve Jobs transformó 7 industrias distintas siendo irritante, brillante, obsesivo y, sobre todo, un purista del diseño de producto.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-slate-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Technology / Macbook" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-slate-500/20 flex items-center justify-center backdrop-blur-xl border border-slate-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Producto</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">Innovar es decir NO a 1000 cosas</h3>
            <p className="text-white/60 mb-8">
              A diferencia de Microsoft o Google, que se expanden hacia todas las direcciones posibles, el genio de Apple radicaba en la <strong>reducción</strong>. En este módulo aprenderás por qué tener menos funciones hace a tu producto más valioso, y cómo fusionar la tecnología dura con el diseño humanista para crear productos que la gente ame.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-slate-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-slate-500/10 group-hover:text-slate-300 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-slate-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-slate-200 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-slate-500/20 bg-gradient-to-b from-slate-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Recursos de Diseño</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Foco (4 Cuadrantes)',
                'Auditoría de Experiencia de Usuario',
                'Framework Arte + Tecnología',
                'Guía de "El Poder de Decir NO"'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/jobs-product-ai" className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Auditor de Producto AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Última Lección</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otro... manténganse hambrientos, manténganse alocados." - Stanford, 2005.</p>
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
