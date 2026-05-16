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
  Sparkles, Layout, BarChart3, Building2, Palette, ShieldAlert,
  Gavel, Heart, Factory
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
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 backdrop-blur-2xl border border-white/10 bg-base-100/40 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 h-16 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-3 group transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white text-lg uppercase tracking-[0.2em] hidden sm:inline-block">Antigravity</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#ecosystem" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Ecosistema" en="Ecosystem" /></a>
            <a href="#white-label" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Marca Blanca" en="White Label" /></a>
            <a href="#industries" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Industrias" en="Industries" /></a>
            <a href="#pricing" className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"><T es="Planes" en="Plans" /></a>
          </nav>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/login" className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              <T es="Entrar" en="Log In" />
            </Link>
            <Link href="/register" className="px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shimmer-btn">
              <T es="Comenzar" en="Join Now" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-56 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <T es="Tecnología IA Clase-Empresa" en="Enterprise-Grade AI Tech" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter"
            >
              SaaS <span className="text-primary italic">Multi-tenant</span> <br />
              <span className="text-shimmer"><T es="Poder Absoluto." en="Absolute Power." /></span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/50 max-w-xl font-medium leading-relaxed"
            >
              <T 
                es="Domina el mercado con un ecosistema de micro-apps diseñado para escalar. Gestiona partners, delega inteligencia y toma el control de tu crecimiento."
                en="Dominate the market with an ecosystem of micro-apps designed to scale. Manage partners, delegate intelligence and take control of your growth." 
              />
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 pt-4"
            >
              <Link href="/register" className="px-10 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl shadow-primary/40 hover:scale-105 transition-all shimmer-btn">
                <T es="Lanzar mi Portal" en="Launch my Portal" />
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                <T es="Ver Demo" en="Watch Demo" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full animate-pulse-subtle" />
            <div className="relative border-glow rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="/antigravity_hero_mockup_1778886932689.png" 
                alt="Antigravity Interface"
                className="w-full h-auto animate-float"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 glass-card flex items-center justify-center animate-float [animation-delay:1s]">
               <BarChart3 className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 glass-card flex items-center justify-center animate-float [animation-delay:2s]">
               <Shield className="w-10 h-10 text-accent-pink" />
            </div>
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

      {/* ── Niches Showcase ── */}
      <section id="industries" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Verticales Especializadas</h2>
            <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Soluciones para <span className="italic text-white/40">cada Nicho.</span>
            </h3>
            <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">
              No creemos en lo generalista. Hemos diseñado ecosistemas específicos para los sectores con mayor demanda operativa.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Agencias', slug: 'agencias', icon: Building2, color: 'hover:border-purple-500/50' },
              { name: 'Legal', slug: 'legal', icon: Gavel, color: 'hover:border-slate-400/50' },
              { name: 'Salud', slug: 'salud', icon: Heart, color: 'hover:border-pink-500/50' },
              { name: 'Manufactura', slug: 'manufactura', icon: Factory, color: 'hover:border-emerald-500/50' },
              { name: 'Inmobiliarias', slug: 'inmobiliarias', icon: Layout, color: 'hover:border-blue-500/50' },
              { name: 'Restaurantes', slug: 'restaurantes', icon: Zap, color: 'hover:border-amber-500/50' },
              { name: 'Academias', slug: 'academias', icon: Globe, color: 'hover:border-indigo-500/50' },
              { name: 'Hoteles', slug: 'hoteles', icon: Building2, color: 'hover:border-cyan-500/50' },
            ].map((niche, i) => (
              <Link key={i} href={`/landings/${niche.slug}`} className="group">
                <GlassCard className={`p-8 h-full flex flex-col items-center text-center gap-6 border-glow transition-all duration-500 group-hover:-translate-y-3`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                    <niche.icon className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                    {niche.name}
                  </p>
                </GlassCard>
              </Link>
            ))}
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
