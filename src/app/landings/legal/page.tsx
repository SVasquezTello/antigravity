'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Shield, Scale, 
  Clock, Target, ChevronDown, FileText, 
  Gavel, Briefcase, Lock
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function LegalLanding() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Corporate Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#02040a]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-black text-black shadow-lg">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-slate-400 italic">Legal</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl">Start Trial</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Scale className="w-4 h-4" /> AI Infrastructure for Law Firms
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-slate-100"
            >
              Legal precision. <span className="text-slate-500 italic">AI speed.</span> Unmatched edge.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Transform your firm with automated contract analysis, litigation drafting, and AI-driven compliance audits.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-slate-200 transition-all">
                Modernize My Firm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                View Solutions
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
            <GlassCard className="relative z-10 p-1 overflow-hidden rounded-3xl border-white/10 bg-slate-900/40">
              <div className="aspect-square bg-[#050014] rounded-2xl flex items-center justify-center border border-white/5 relative group">
                <FileText className="w-32 h-32 text-slate-800 absolute group-hover:scale-110 transition-transform duration-700" />
                <Shield className="w-16 h-16 text-slate-400 relative z-10 animate-pulse" />
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </header>

      {/* ── Pain Points ── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">The Burden of Legacy Law</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight uppercase">Don't let <span className="italic text-white/20">billable hours</span> cap your growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Document Fatigue', desc: 'Sifting through hundreds of pages for a single clause is a waste of senior talent.' },
              { icon: Gavel, title: 'Litigation Risk', desc: 'Inconsistent drafting leads to avoidable legal loopholes and client liability.' },
              { icon: Briefcase, title: 'Operational Stagnation', desc: 'Manual research prevents your firm from taking on more complex, high-value cases.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-slate-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-slate-700 mb-6 group-hover:text-slate-400 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section id="features" className="py-32 px-6 relative z-10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <GlassCard className="p-8 border-slate-700/30 bg-slate-800/10">
                     <Lock className="w-8 h-8 text-slate-400 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Contract Audit</p>
                     <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Identify loopholes in seconds</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-white/5">
                     <FileText className="w-8 h-8 text-white/20 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Drafting AI</p>
                     <p className="text-[10px] text-white/30 font-black uppercase mt-2">Professional litigation prep</p>
                  </GlassCard>
               </div>
               <div className="space-y-4">
                  <GlassCard className="p-8 border-white/5">
                     <Target className="w-8 h-8 text-white/20 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Strategy Bot</p>
                     <p className="text-[10px] text-white/30 font-black uppercase mt-2">Data-driven case outcomes</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-blue-900/20 bg-blue-900/5">
                     <Shield className="w-8 h-8 text-blue-500 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Compliance 24/7</p>
                     <p className="text-[10px] text-blue-400 font-black uppercase mt-2">Automated regulatory checks</p>
                  </GlassCard>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Algorithmic Jurisprudence</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
              The <span className="italic text-white/40">Sovereign</span> <br />Legal Assistant
            </h3>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Leverage custom-trained legal models to augment your firm's intelligence. Antigravity Legal handles the grunt work so you can focus on the win.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Automated Contract Redlining',
                'Pre-trial Evidence Analysis',
                'GDPR & Compliance Monitoring',
                'Entity Structure Optimization',
                'IP Portfolio Management',
                'Bilingual Legal Drafting'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-slate-700/20 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-slate-600/10 blur-[80px] rounded-full group-hover:bg-slate-600/20 transition-all duration-700" />
            
            <div className="space-y-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                Empower your <span className="text-slate-500 italic">Counsel</span> <br />with <span className="text-slate-500 italic">Hyper-Speed</span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto font-medium">
                The most advanced AI operating system for modern law firms. Book your deployment today.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-lg bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-200 transition-all">
                Launch My Firm
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-lg bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Request Demo
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center bg-[#02040a]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-black font-black shadow-lg">A</div>
              <span className="text-white font-black uppercase tracking-widest text-lg">Antigravity <span className="text-slate-500 italic">Legal</span></span>
           </div>
           <nav className="flex flex-wrap justify-center gap-10 text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Disclaimers</Link>
              <Link href="#" className="hover:text-white transition-colors">Security</Link>
           </nav>
           <p className="text-white/10 font-medium text-xs">© 2026 Antigravity Systems Inc. Legal Edition.</p>
        </div>
      </footer>
    </div>
  )
}
