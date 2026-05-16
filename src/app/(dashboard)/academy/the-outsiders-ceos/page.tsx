'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, BarChart3, Building2, 
  ArrowRightLeft, Briefcase, ChevronLeft, ArrowUpRight, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function TheOutsidersMasterclassPage() {
  const chapters = [
    {
      icon: ArrowRightLeft,
      title: 'Capítulo 1: El Trabajo Real del CEO (Asignación de Capital)',
      time: '18 mins',
      content: 'Los 8 CEOs "Outsiders" demostraron que el éxito no depende del carisma, sino de la Asignación de Capital. Tienes 5 opciones: Revertir en el negocio, Comprar otras empresas, Pagar deuda, Dar dividendos o Recomprar acciones. Aprende a elegir la correcta.'
    },
    {
      icon: Briefcase,
      title: 'Capítulo 2: Descentralización Extrema',
      time: '15 mins',
      content: 'Cómo empresas como Berkshire Hathaway (Warren Buffett) o Teledyne gestionan miles de empleados con sedes centrales de menos de 50 personas. La autonomía operativa combinada con centralización financiera es el secreto de los altos márgenes.'
    },
    {
      icon: BarChart3,
      title: 'Capítulo 3: Flujo de Caja vs Beneficio por Acción (EPS)',
      time: '20 mins',
      content: 'Por qué los CEOs promedio se obsesionan con el Beneficio por Acción (EPS) para contentar a Wall Street, mientras que los Outsiders (como John Malone) inventaron métricas como el EBITDA para optimizar la creación de Flujo de Caja libre y minimizar impuestos.'
    },
    {
      icon: Building2,
      title: 'Capítulo 4: El Modelo Warren Buffett (El Float)',
      time: '22 mins',
      content: 'Análisis profundo de la máquina financiera de Berkshire Hathaway. Cómo usar el "Float" de las aseguradoras (dinero de las primas pagadas por adelantado) para financiar inversiones de alto rendimiento a un costo de capital negativo.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <BarChart3 className="w-4 h-4" /> Finanzas y Dirección General
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          The Outsiders: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic">Los 8 Mejores CEOs de la Historia</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Basado en el aclamado libro de William N. Thorndike. Aprende las tácticas de asignación de capital que permitieron a estos 8 líderes superar al índice S&P 500 por más de 20 veces, rompiendo todas las reglas tradicionales de Wall Street.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-emerald-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Wall Street / Capital Allocation" 
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
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Mito del CEO Carismático</h3>
            <p className="text-white/60 mb-8">
              Olvídate de la imagen de Hollywood. Los CEOs más rentables de los últimos 50 años rara vez daban entrevistas, tenían oficinas modestas y operaban como inversores, no como gerentes. Su súper poder era entender matemáticamente cuándo recomprar acciones, cuándo usar deuda estratégicamente y cuándo deshacerse de divisiones no rentables.
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
          <GlassCard className="p-6 border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400">Recursos Financieros</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Asignación de Capital',
                'Calculadora de Recompra (Buybacks)',
                'Plantilla de Descentralización',
                'Evaluador de Adquisiciones (Hurdle Rate)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/outsiders-capital-allocator" className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-600/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Lanzar Simulador Financiero
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de Oro (Buffett)</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Sé temeroso cuando otros sean codiciosos, y sé codicioso cuando otros sean temerosos". Las mejores recompras se hacen cuando Wall Street entra en pánico.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
