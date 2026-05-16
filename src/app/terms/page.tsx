'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gavel, ArrowLeft, CheckCircle2, AlertTriangle, Scale, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Regresar al Inicio
        </Link>

        <header className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Términos de <span className="text-primary italic">Servicio</span></h1>
          <p className="text-white/40 text-lg">Última actualización: 10 de Mayo, 2026</p>
        </header>

        <GlassCard className="p-8 md:p-12 space-y-10 border-white/5">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Uso de la Plataforma</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Al utilizar Antigravity, aceptas cumplir con todas las leyes locales e internacionales aplicables. El uso de la plataforma para actividades ilícitas resultará en la terminación inmediata de tu cuenta.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Clock className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Suscripciones y Pagos</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Los planes premium se facturan mensual o anualmente. Puedes cancelar tu suscripción en cualquier momento desde el panel de facturación. No se ofrecen reembolsos por periodos ya facturados a menos que se indique lo contrario.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Limitación de Responsabilidad</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Antigravity utiliza modelos de IA de terceros. No nos hacemos responsables de las "alucinaciones" o errores en la generación de datos. Siempre debes verificar los resultados antes de tomar decisiones críticas de negocio.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Gavel className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Jurisdicción</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Estos términos se rigen por las leyes vigentes. Cualquier disputa legal será resuelta en los tribunales competentes de la jurisdicción principal de Antigravity.
            </p>
          </section>
        </GlassCard>

        <footer className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
          Antigravity © 2026 | Legal Information
        </footer>
      </div>
    </div>
  )
}
