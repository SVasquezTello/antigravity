'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { T } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Loader2 } from 'lucide-react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación manual para evitar el tooltip del navegador
    if (!email || !password) {
      setError(
        document.documentElement.lang === 'en' 
          ? "Please fill in all fields to continue." 
          : "Por favor, completa todos los campos para continuar."
      )
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await loginAction(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.message || "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 selection:bg-primary/30 selection:text-white">
      <div className="mesh-gradient" />
      <div className="glow-orb w-[600px] h-[600px] bg-primary/10 top-[-200px] left-[-200px] animate-pulse-subtle" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <header className="flex flex-col items-center gap-6">
          <Link href="/" className="group flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-primary to-accent-pink flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                <span className="text-white font-black text-2xl">A</span>
             </div>
             <div className="text-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Antigravity</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Premium AI Hub</p>
             </div>
          </Link>
        </header>

        <div className="glass-card p-10 animate-in fade-in zoom-in-95 duration-700 bg-white/[0.02] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="mb-10 text-center">
             <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
               <T es="Bienvenido" en="Welcome" />
             </h1>
             <p className="text-white/40 font-medium text-sm">
               <T es="Ingresa a tu ecosistema premium" en="Enter your premium ecosystem" />
             </p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">
                <T es="Correo Electrónico" en="Email" />
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium text-sm" 
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  <T es="Contraseña" en="Password" />
                </label>
                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                  <T es="¿Olvidaste?" en="Forgot?" />
                </Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium text-sm" 
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group px-8 py-5 rounded-2xl font-black text-white overflow-hidden transition-all flex items-center justify-center disabled:opacity-50 text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
            >
              <div className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors"></div>
              {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <span className="relative z-10"><T es="Ingresar" en="Log In" /></span>}
            </button>
          </form>

          {/* Botón de Acceso Demo para Desarrollo */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <button 
              onClick={() => {
                setEmail('gavanzadavid@gmail.com');
                setPassword('Antigravity2024!'); 
              }}
              className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/[0.02] hover:text-white/60 transition-all"
            >
              <T es="⚡ Acceso Rápido (Demo)" en="⚡ Quick Access (Demo)" />
            </button>
          </div>

          <p className="mt-10 text-center text-xs font-bold text-white/20 uppercase tracking-widest">
            <T es="¿No tienes cuenta?" en="Don't have an account?" />{' '}
            <Link href="/register" className="text-white hover:text-primary transition-colors">
              <T es="Regístrate" en="Sign up" />
            </Link>
          </p>
        </div>
        
        <div className="flex justify-center">
           <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
