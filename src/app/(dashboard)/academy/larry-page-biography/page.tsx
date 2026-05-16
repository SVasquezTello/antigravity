'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Rocket, Cpu, 
  Lightbulb, Globe, ChevronLeft, ArrowUpRight, Zap
} from 'lucide-react'
import Link from 'next/link'

export default function LarryPageMasterclassPage() {
  const chapters = [
    {
      icon: Lightbulb,
      title: 'Capítulo 1: La Lección de Nikola Tesla',
      time: '12 mins',
      content: 'Por qué tener la mejor tecnología no sirve de nada sin distribución. Larry Page aprendió de Nikola Tesla que la invención pura sin visión de negocios lleva al fracaso. El inicio de la dualidad Producto-Mercado.'
    },
    {
      icon: Cpu,
      title: 'Capítulo 2: El Algoritmo de 56 Mil Millones',
      time: '18 mins',
      content: 'El origen de PageRank en Stanford. Cómo una visión nocturna en 1995 de "ordenar la web según los enlaces que recibe" se convirtió en el monopolio más grande de la historia de la información.'
    },
    {
      icon: Zap,
      title: 'Capítulo 3: La Mentalidad 10X',
      time: '20 mins',
      content: 'La filosofía de innovación de Google: Un producto no puede ser un 10% mejor, tiene que ser 10 VECES (1000%) mejor que la competencia. Cómo esta regla obligaba al equipo a re-pensar los problemas desde cero (First Principles).'
    },
    {
      icon: Rocket,
      title: 'Capítulo 4: Moonshots y Filantropía de Escala',
      time: '15 mins',
      content: 'El nacimiento de Alphabet y la filosofía de resolver problemas que sigan siendo relevantes en 100 años (vehículos autónomos, extensión de vida). Por qué Larry considera que darle su fortuna a Elon Musk para ir a Marte es la mejor filantropía.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Rocket className="w-4 h-4" /> Innovación y Moonshots
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          La Mentalidad 10X: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500 italic">El Código Fuente de Google</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Una disección de la mente de Larry Page. Aprende por qué las mejoras incrementales (10%) son una pérdida de tiempo y cómo aplicar la filosofía de "Moonshots" para construir productos que dominen la próxima década.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-indigo-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Technology / Server Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center backdrop-blur-xl border border-indigo-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Caso de Estudio</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Fracaso del Inventor</h3>
            <p className="text-white/60 mb-8">
              A los 12 años, Larry Page leyó la biografía de Nikola Tesla y aprendió su lección más importante: <strong>Puedes inventar la mejor tecnología del mundo (corriente alterna), pero si no tienes el modelo de negocios para comercializarla, morirás quebrado</strong>. Esta es la diferencia fundamental entre ser un "Inventor" y ser un "Emprendedor".
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-indigo-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-indigo-500/20 bg-gradient-to-b from-indigo-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Recursos de Innovación</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Mentalidad 10X',
                'Framework de "Moonshots"',
                'Estructura de Alphabet (Spin-offs)',
                'Plantilla Producto-Mercado (Tesla vs Edison)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/page-moonshot-ai" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Evaluador Moonshot 10X
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de los 100 Años</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"No emprendas proyectos que dentro de 100 años sean irrelevantes." - La filosofía central detrás de Alphabet y X (The Moonshot Factory).</p>
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
