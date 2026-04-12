'use client'
import Link from 'next/link'
import { T } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col pt-6 px-6 relative z-10 w-full max-w-6xl mx-auto">
      <header className="flex justify-between items-center z-20 animate-entrance">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="gradient-text text-3xl">MicroApps</span>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center z-10 p-4">
        <div className="glass-card w-full max-w-4xl p-10 md:p-20 flex flex-col items-center justify-center space-y-10 animate-entrance animation-delay-1000 shadow-2xl shadow-primary/5">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]">
              <span className="text-white opacity-90"><T es="El Futuro de las" en="The Future of" /></span> <br/>
              <span className="gradient-text pb-2 inline-block">
                <T es="Micro Aplicaciones" en="Micro Applications" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed animate-entrance animation-delay-2000">
              <T 
                es="Un ecosistema premium, rápido y seguro. Todo lo que necesitas para tu flujo de trabajo en un portal oscuro y minimalista." 
                en="A premium, fast, and secure ecosystem. Everything you need for your workflow in a dark and minimalist portal." 
              />
            </p>
          </div>

          <div className="flex gap-4 pt-4 w-full sm:w-auto flex-col sm:flex-row animate-entrance animation-delay-3000">
            <Link href="/register" className="relative group px-10 py-5 rounded-2xl font-bold text-white overflow-hidden transition-all flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-pink to-accent-warm opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-warm blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <span className="relative z-10 text-lg"><T es="Comenzar Gratis" en="Start for Free" /></span>
            </Link>
            
            <Link href="/login" className="px-10 py-5 rounded-2xl font-bold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center backdrop-blur-xl hover:scale-105 active:scale-95 text-lg">
              <T es="Iniciar Sesión" en="Log In" />
            </Link>
          </div>
        </div>

        {/* Floating Badges for visual flavor */}
        <div className="absolute bottom-10 left-10 hidden lg:flex flex-col gap-2 p-4 glass-card border-none bg-white/2 animate-entrance animation-delay-4000">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Gemini 2.0 API Live</span>
          </div>
        </div>
      </main>
    </div>
  )
}
