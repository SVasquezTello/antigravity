'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Users, Code, 
  Scale, BookOpen, ChevronLeft, ArrowUpRight, ShieldAlert
} from 'lucide-react'
import Link from 'next/link'

export default function BillGatesMasterclassPage() {
  const chapters = [
    {
      icon: Code,
      title: 'Capítulo 1: La Urgencia y el Abandono (Harvard a Microsoft)',
      time: '12 mins',
      content: 'Por qué el riesgo de abandonar la universidad en EE. UU. era bajo si no tenías familia que mantener. La visión de la era del software y la paranoia de que si no actuaban rápido, perderían la ventana de oportunidad.'
    },
    {
      icon: Users,
      title: 'Capítulo 2: El Cuello de Botella del Fundador',
      time: '18 mins',
      content: 'Cómo Bill Gates leía y reescribía el código de todos hasta llegar a los 40 empleados. El momento de quiebre donde el perfeccionismo ahoga el crecimiento y la decisión vital de contratar a Steve Ballmer para delegar el reclutamiento y la gestión de promesas.'
    },
    {
      icon: ShieldAlert,
      title: 'Capítulo 3: El Costo de la Distracción (Caso Antimonopolio)',
      time: '15 mins',
      content: 'Una reflexión honesta sobre su mayor error: perder el mercado de los teléfonos móviles (Windows Mobile frente a Android) debido a la inmensa distracción personal y corporativa que supuso el juicio antimonopolio del gobierno.'
    },
    {
      icon: Scale,
      title: 'Capítulo 4: Filantropía y Efecto Escala',
      time: '24 mins',
      content: 'Transición de optimizar líneas de código a optimizar vidas humanas. Por qué el cerebro humano no procesa estadísticas de un millón de muertes y requiere de historias individuales (el problema de 10 a la 6ta) para motivar la filantropía global, inspirado en Warren Buffett.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Users className="w-4 h-4" /> Escalamiento y Delegación
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Sistema Gates: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 italic">Del Micromanagement al Imperio</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Una clase maestra sobre cómo el fundador de Microsoft tuvo que vencer su propia obsesión por el control técnico para poder escalar una organización de miles de personas. Lecciones vitales para cualquier CEO técnico o creador de agencias.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-blue-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Microchip / Scaling" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Entrevista</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El CEO que no creía en las Vacaciones</h3>
            <p className="text-white/60 mb-8">
              En sus 20s, Bill Gates memorizaba las matrículas de sus empleados para saber quién llegaba primero y quién se iba al último. En este módulo analizamos por qué esa ética <em>monomaníaca</em> es útil en la fase cero, pero tóxica y limitante en la fase de escalamiento. Descubrirás cómo el arte de <strong>seleccionar y delegar en gerentes mejores que tú</strong> es el verdadero secreto de los unicornios.
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
          <GlassCard className="p-6 border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Recursos de Escalamiento</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Delegación Ejecutiva',
                'El Problema de "10 a la 6ta"',
                'Estructura de Equipos Autónomos',
                'Filtro de Inversión (Aprender a decir NO)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/gates-delegation-ai" className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Motor de Delegación AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Notas del Inversor</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">Aprende la regla de Warren Buffett: Tu agenda en blanco no es señal de inactividad, es tu escudo contra distracciones sin sentido. Di NO al 99% de las oportunidades.</p>
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
