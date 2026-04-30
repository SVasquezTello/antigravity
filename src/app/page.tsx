'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { T } from '@/components/i18n-provider'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { PricingSection } from '@/components/landing/PricingSection'
import { 
  Zap, Shield, Globe, Users, 
  ArrowRight, CheckCircle2,
  Sparkles, Layout, BarChart3, Building2, Palette, ShieldAlert
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

// Variantes de animación
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function LandingPage() {
  const { language } = useTranslation()

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-20 bg-base-100">
      
      {/* ── Fondo Animado (Mesh) ── */}
      <div className="mesh-gradient" />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-base-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white text-2xl uppercase tracking-[0.1em] hidden sm:inline-block">Antigravity</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#ecosystem" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Ecosistema" en="Ecosystem" /></a>
            <a href="#white-label" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Marca Blanca" en="White Label" /></a>
            <a href="#industries" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Industrias" en="Industries" /></a>
            <a href="#pricing" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Planes" en="Plans" /></a>
          </nav>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/login" className="hidden sm:block text-[10px] font-black text-white/50 hover:text-white transition-colors uppercase tracking-widest">
              <T es="Entrar" en="Log In" />
            </Link>
            <Link href="/register" className="px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:invert transition-all active:scale-95 shadow-xl">
              <T es="Comenzar" en="Join Now" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <T es="Infraestructura IA de Nueva Generación" en="Next-Gen AI Infrastructure" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter"
          >
            SaaS <span className="text-primary italic">Multi-tenant</span> <br />
            <span className="gradient-text"><T es="Poder Absoluto." en="Absolute Power." /></span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            <T 
              es="Un ecosistema integral de micro-apps diseñado para escalar negocios, gestionar partners y delegar inteligencia. Más que IA, es el sistema operativo de tu crecimiento."
              en="A comprehensive micro-apps ecosystem designed to scale businesses, manage partners, and delegate intelligence. More than AI, it's your growth's OS." 
            />
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Link href="/register" className="px-12 py-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
              <T es="Lanzar mi Portal" en="Launch my Portal" />
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
              <T es="Ver Demo" en="Watch Demo" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Ecosystem Section (New Area) ── */}
      <section id="ecosystem" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <div className="inline-flex items-center gap-3 text-primary uppercase font-black tracking-widest text-xs">
                  <Users className="w-5 h-5" />
                  <T es="Jerarquía de 4 Niveles" en="4-Tier Hierarchy" />
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Gestiona <span className="italic text-white/40">miles</span> <br /> de usuarios con facilidad.
               </h2>
               <div className="space-y-6">
                  {[
                    { title: 'Super Admin', desc: 'Control total de la infraestructura y partners.' },
                    { title: 'Partner Owner', desc: 'Gestión de marca blanca y su propia cartera de clientes.' },
                    { title: 'Client Owner', desc: 'Control del workspace empresarial y su equipo de staff.' },
                    { title: 'Staff Member', desc: 'Ejecución operativa de micro-apps asignadas.' }
                  ].map((role, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                       <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                       <div>
                          <p className="text-white font-bold">{role.title}</p>
                          <p className="text-sm text-white/30">{role.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
               <GlassCard className="p-8 relative z-10 border-primary/30">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/50" />
                           <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                           <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Multi-tenant Security</span>
                     </div>
                     <div className="p-6 bg-base-100/50 rounded-2xl border border-white/5 space-y-4">
                        <div className="h-4 w-1/3 bg-primary/20 rounded shadow-sm" />
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-12 w-full bg-primary/5 border border-primary/20 rounded-xl" />
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-white/5 rounded-2xl text-center">
                           <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Row Level</p>
                           <p className="text-xs text-white font-black italic">ENFORCED</p>
                        </div>
                        <div className="flex-1 p-4 bg-white/5 rounded-2xl text-center">
                           <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Data Silos</p>
                           <p className="text-xs text-white font-black italic">ISOLATED</p>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── White Label Section ── */}
      <section id="white-label" className="py-32 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
               Tu Marca. <span className="text-primary italic">Nuestro Motor.</span>
            </h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">
               Convierte Antigravity en tu propia plataforma con nuestro sistema de Marca Blanca integral.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <GlassCard className="p-10 space-y-6 border-white/10 hover:border-primary transition-all">
                <Palette className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{language === 'en' ? 'Custom Colors' : 'Colores Propios'}</h3>
                <p className="text-sm text-white/30">{language === 'en' ? 'Adapt the entire UI with your primary brand hex codes.' : 'Adapta toda la interfaz con tus códigos hexadecimales corporativos.'}</p>
             </GlassCard>
             <GlassCard className="p-10 space-y-6 border-white/10 hover:border-primary transition-all">
                <Building2 className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{language === 'en' ? 'Custom Logos' : 'Logo e Icono'}</h3>
                <p className="text-sm text-white/30">{language === 'en' ? 'Upload your assets and dominate the dashboard experience.' : 'Sube tus logos y domina la experiencia del dashboard.'}</p>
             </GlassCard>
             <GlassCard className="p-10 space-y-6 border-white/10 hover:border-primary transition-all">
                <Globe className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{language === 'en' ? 'Subdomains' : 'Subdominios'}</h3>
                <p className="text-sm text-white/30">{language === 'en' ? 'Unique access points for each of your partners or clients.' : 'Puntos de acceso únicos para cada uno de tus socios o clientes.'}</p>
             </GlassCard>
          </div>
        </div>
      </section>

      {/* --- Industries Banner --- */}
      <section id="industries" className="py-40 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
         <div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-10">
               +200 <br /><span className="gradient-text">Apps Listas.</span>
            </h2>
            <div className="flex flex-wrap gap-3">
               {['RRHH', 'Finanzas', 'E-commerce', 'Eventos', 'Marketing', 'Legal', 'Sales'].map(tag => (
                 <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {tag}
                 </span>
               ))}
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
               <div className="h-40 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                  <p className="text-white font-bold italic">RRHH Suite</p>
                  <p className="text-[10px] text-primary font-black uppercase">52 Tools</p>
               </div>
               <div className="h-60 bg-primary/10 rounded-3xl border border-primary/20 p-6 flex flex-col justify-end overflow-hidden relative">
                  <div className="absolute top-4 right-4"><Zap className="text-primary w-8 h-8 opacity-20" /></div>
                  <p className="text-white font-bold italic">Finanzas Pro</p>
                  <p className="text-[10px] text-primary font-black uppercase">48 Tools</p>
               </div>
            </div>
            <div className="space-y-4 pt-12">
               <div className="h-60 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                  <p className="text-white font-bold italic">E-commerce</p>
                  <p className="text-[10px] text-primary font-black uppercase">60 Tools</p>
               </div>
               <div className="h-40 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                  <p className="text-white font-bold italic">Eventos VIP</p>
                  <p className="text-[10px] text-primary font-black uppercase">40 Tools</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- Trust & Features --- */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
               <div>
                  <BarChart3 className="w-10 h-10 text-primary mx-auto mb-6" />
                  <h4 className="text-white font-black uppercase tracking-widest mb-2">Real Analytics</h4>
                  <p className="text-xs text-white/30">Métricas ROI integradas.</p>
               </div>
               <div>
                  <ShieldAlert className="w-10 h-10 text-primary mx-auto mb-6" />
                  <h4 className="text-white font-black uppercase tracking-widest mb-2">Security Audit</h4>
                  <p className="text-xs text-white/30">Logs totales para admins.</p>
               </div>
               <div>
                  <Layout className="w-10 h-10 text-primary mx-auto mb-6" />
                  <h4 className="text-white font-black uppercase tracking-widest mb-2">SaaS Quotas</h4>
                  <p className="text-xs text-white/30">Límites y planes dinámicos.</p>
               </div>
               <div>
                  <Globe className="w-10 h-10 text-primary mx-auto mb-6" />
                  <h4 className="text-white font-black uppercase tracking-widest mb-2">Global Scale</h4>
                  <p className="text-xs text-white/30">Puntos finales distribuidos.</p>
               </div>
            </div>
         </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-6">
        <PricingSection />
      </section>

      {/* ── CTA Final ── */}
      <section className="max-w-7xl mx-auto px-6 py-32">
         <div className="glass-card p-12 md:p-24 bg-gradient-to-r from-primary/20 via-primary/5 to-accent-pink/10 border-none relative overflow-hidden flex flex-col items-center text-center space-y-10 group rounded-[3rem]">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] group-hover:bg-primary/40 transition-all duration-1000" />
            <div className="space-y-4 relative z-10">
               <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter">
                  <T es="EL FUTURO NO SE ESPERA," en="FUTURE DOESN'T WAIT," /><br />
                  <span className="text-primary italic"><T es="SE CONSTRUYE." en="IT'S BUILT." /></span>
               </h2>
               <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto">
                  Toma el control absoluto de tu ecosistema de micro-apps hoy mismo.
               </p>
            </div>
            <Link href="/register" className="px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-lg hover:scale-105 transition-all shadow-2xl relative z-10 font-mono">
               DEPLOY_ANTIGRAVITY_NOW()
            </Link>
         </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 font-black">A</div>
            <span className="text-white/20 font-bold uppercase tracking-widest text-sm">Antigravity Enterprise © 2026. All rights reserved.</span>
         </div>
         <div className="flex gap-10 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
         </div>
      </footer>
    </div>
  )
}
