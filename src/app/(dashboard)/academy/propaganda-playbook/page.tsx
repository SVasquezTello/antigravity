'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Target, CheckCircle2, 
  ShieldAlert, BookOpen, ChevronLeft, ArrowUpRight, Scale
} from 'lucide-react'
import Link from 'next/link'

export default function PropagandaPlaybookPage() {
  const chapters = [
    {
      icon: ShieldAlert,
      title: 'Capítulo 1: El Lado Oscuro de la IA (El Fraude del Billón de Dólares)',
      time: '12 mins',
      content: 'Cómo una empresa de telemedicina usó IA para generar 800 perfiles falsos de médicos en Facebook, pacientes inventados con manos deformes y fotos de "antes y después" falsificadas para vender medicamentos no aprobados por la FDA. Un caso de estudio sobre por qué la falta de integridad destruye negocios millonarios.'
    },
    {
      icon: BookOpen,
      title: 'Capítulo 2: El Libro de Jugadas de Edward Bernays',
      time: '15 mins',
      content: 'Descubre la táctica de 1920 llamada "Autoridad de Terceros Manufacturada". Las personas no confían en empresas ni en anuncios, pero confían ciegamente en Expertos. Bernays usó a médicos reales para vender tocino y cigarrillos. Hoy, los estafadores usan IA, pero la psicología humana no ha cambiado.'
    },
    {
      icon: Scale,
      title: 'Capítulo 3: La Versión Ética (Cómo hacerlo bien)',
      time: '20 mins',
      content: 'Si tu producto requiere que inventes expertos con IA, tu producto es basura. Aprende las 4 Reglas de Oro de Russell: 1. Usa testimonios 100% reales. 2. Construye relaciones genuinas con expertos de tu nicho. 3. Conoce las reglas de la FTC (Federal Trade Commission) antes de lanzar. 4. Mejora tu producto hasta que la autoridad sea orgánica.'
    },
    {
      icon: Target,
      title: 'Capítulo 4: Inyectando Autoridad en tu Embudo',
      time: '18 mins',
      content: 'Cómo aplicar los descubrimientos de Sigmund Freud (fuerzas inconscientes) y las tácticas de relaciones públicas de Bernays de manera ética en tus propios Embudos de Venta (Funnels) y anuncios. Multiplica tus conversiones asociando tu marca a figuras de alta confianza.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldAlert className="w-4 h-4" /> Caso de Estudio: Ética y Ventas
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Playbook de la Propaganda: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600 italic">Autoridad Manufacturada</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Decodificando las artes oscuras de la persuasión corporativa y cómo aplicar estas técnicas psicológicas centenarias de forma 100% ética para escalar tu negocio sin terminar clausurado por la FTC.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-red-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1555861496-faa3e117400a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Propaganda Playbook Cover" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center backdrop-blur-xl border border-red-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Masterclass</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">La Psicología detrás del "Experto"</h3>
            <p className="text-white/60 mb-8">
              En este análisis profundo basado en la metodología de <strong>Russell Brunson</strong>, desentrañamos cómo la <em>"Autoridad de Terceros"</em> controla el comportamiento de las masas. Aprenderás a utilizar el marco de Edward Bernays para elevar tus conversiones drásticamente, sin cruzar la delgada línea del engaño.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-red-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-red-500/20 bg-gradient-to-b from-red-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Recursos y Herramientas</h4>
            
            <ul className="space-y-4">
              {[
                'Motor de Retención de Clientes',
                'Analizador de Cumplimiento (FTC)',
                'Generador de Ofertas (Hormozi)',
                'Estructura de VSL (Brunson)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/acad-funnel-hacker-ai" className="w-full py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-600/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Lanzar AI Funnel Hacker
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Próximo Módulo</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">Dan Kennedy: Los secretos éticos de la respuesta directa para convertir clics en clientes de alto valor.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
