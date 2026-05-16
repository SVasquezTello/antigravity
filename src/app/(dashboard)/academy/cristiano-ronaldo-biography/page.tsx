'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Trophy, Activity, 
  Dumbbell, Target, ChevronLeft, ArrowUpRight, Shield
} from 'lucide-react'
import Link from 'next/link'

export default function CristianoRonaldoMasterclassPage() {
  const chapters = [
    {
      icon: Dumbbell,
      title: 'Capítulo 1: Disciplina sobre Talento',
      time: '12 mins',
      content: 'El mito del talento natural. Cristiano Ronaldo no nació siendo el mejor, se fabricó a sí mismo. La lección del entrenamiento invisible: lo que haces cuando las luces se apagan y la tribuna se vacía.'
    },
    {
      icon: Shield,
      title: 'Capítulo 2: El Ego como Escudo y Motor',
      time: '18 mins',
      content: 'A diferencia de líderes que fingen falsa humildad, Ronaldo usa la arrogancia y su "ego terrible" como una herramienta de auto-exigencia. Si declaras ser el mejor, estás obligado a entrenar como el mejor para no quedar en ridículo.'
    },
    {
      icon: Trophy,
      title: 'Capítulo 3: La Marca CR7 (El Atleta-Empresa)',
      time: '15 mins',
      content: 'En 2008 patentó CR7, convirtiéndose en el primer jugador moderno en operar como una corporación multinacional. El fútbol es solo el vehículo de marketing para vender hoteles, ropa, perfumes y clínicas.'
    },
    {
      icon: Activity,
      title: 'Capítulo 4: Inversión en el Hardware (Tu Cuerpo)',
      time: '20 mins',
      content: 'Ronaldo invierte millones de euros al año en crioterapia, nutricionistas, psicólogos y especialistas del sueño. Tu cuerpo y tu mente son los servidores de tu empresa; si fallan, el imperio colapsa.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Activity className="w-4 h-4" /> Alto Rendimiento y Marca
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Método CR7: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">Disciplina Extrema y Capitalización de Marca</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Cómo un niño pobre de Madeira que fue expulsado del colegio se convirtió en el deportista más rentable de la historia. Una clase magistral sobre obsesión, ética de trabajo y construcción de marca personal.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-blue-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Football / Performance" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Rendimiento</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">La Obsesión como Ventaja Competitiva</h3>
            <p className="text-white/60 mb-8">
              En el mundo de los negocios, al igual que en el deporte, el talento está sobrevalorado. Cristiano Ronaldo entendió temprano que enfrentaría a rivales (como Messi) que nacieron con un don natural inigualable. Su única forma de competir y superarlos fue transformándose en una máquina absoluta de repetición y disciplina. **"Si tú entrenas 2 horas, yo entreno 4. Si tú comes bien, yo peso mi comida"**.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-blue-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-blue-500/20 bg-gradient-to-b from-blue-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Recursos de Rendimiento</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Entrenamiento Invisible',
                'Protocolo de Recuperación y Foco',
                'Estructura de Capitalización de Marca',
                'Auditoría de Entorno de Alto Nivel'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/ronaldo-performance-ai" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Auditor de Alto Rendimiento
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de Disciplina</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"El talento sin trabajo duro no es nada. La motivación es temporal, la disciplina es para toda la vida."</p>
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
