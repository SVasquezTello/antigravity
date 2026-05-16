'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Lock, Eye, FileText, Globe } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Regresar al Inicio
        </Link>

        <header className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Política de <span className="text-primary italic">Privacidad</span></h1>
          <p className="text-white/40 text-lg">Última actualización: 10 de Mayo, 2026</p>
        </header>

        <GlassCard className="p-8 md:p-12 space-y-10 border-white/5">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Eye className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Recopilación de Datos</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              En Antigravity, recopilamos información básica para proporcionarte un servicio de IA personalizado. Esto incluye tu nombre, correo electrónico y datos de uso de las micro-aplicaciones. No vendemos tus datos a terceros.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Seguridad de la IA</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Los prompts y datos que ingresas en nuestras micro-apps son procesados de forma segura. Utilizamos cifrado de grado bancario (AES-256) y nos aseguramos de que tu propiedad intelectual esté protegida en todo momento.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Globe className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Cookies y Rastreo</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Utilizamos cookies esenciales para mantener tu sesión activa y mejorar el rendimiento de la plataforma. Puedes configurar tu navegador para rechazar cookies, pero algunas funciones de Antigravity podrían no operar correctamente.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Tus Derechos</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Para cualquier solicitud de privacidad, contáctanos en <span className="text-white font-bold">privacy@antigravity-ia.com</span>.
            </p>
          </section>

          <section id="delete-account" className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-primary">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Eliminación de Cuenta y Datos</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              En cumplimiento con las políticas de Google Play, Antigravity Labs facilita la eliminación total de tu cuenta y datos asociados. Para solicitar la eliminación de tu cuenta y todos los datos personales vinculados (nombre, correo e historial de ejecuciones), simplemente envía un correo electrónico a <span className="text-white font-bold">privacy@antigravity-ia.com</span>. Tu solicitud será procesada y los datos eliminados permanentemente de nuestros servidores en un plazo máximo de 48 horas.
            </p>
          </section>
        </GlassCard>

        <footer className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
          Antigravity © 2026 | All Rights Reserved
        </footer>
      </div>
    </div>
  )
}
