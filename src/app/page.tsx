import Link from 'next/link'
import { T } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col pt-6 px-6 relative z-10 w-full max-w-6xl mx-auto">
      <header className="flex justify-between items-center z-10">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="gradient-text">MicroApps</span>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center z-10 p-4">
        <div className="glass-card w-full p-8 md:p-14 flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight">
            <T es="El Futuro de las" en="The Future of" /> <br/>
            <span className="gradient-text">
              <T es="Micro Aplicaciones" en="Micro Applications" />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-base-content/80 max-w-xl mx-auto font-light leading-relaxed">
            <T 
              es="Un ecosistema premium, rápido y seguro. Todo lo que necesitas para tu flujo de trabajo en un portal oscuro y minimalista." 
              en="A premium, fast, and secure ecosystem. Everything you need for your workflow in a dark and minimalist portal." 
            />
          </p>

          <div className="flex gap-4 pt-4 w-full sm:w-auto flex-col sm:flex-row">
            <Link href="/register" className="relative group px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-pink to-accent-warm opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-warm blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <span className="relative z-10"><T es="Comenzar Gratis" en="Start for Free" /></span>
            </Link>
            
            <Link href="/login" className="px-8 py-4 rounded-xl font-semibold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center backdrop-blur-md">
              <T es="Iniciar Sesión" en="Log In" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
