'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { T } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('ok')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col pt-6 px-6 relative z-10 w-full max-w-6xl mx-auto">
      <header className="flex justify-between items-center z-10">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 transition-transform hover:scale-105">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="gradient-text">MicroApps Hub</span>
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center z-10 p-4">
        <div className="glass-card w-full max-w-md p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">
            <T es="Recuperar Contraseña" en="Reset Password" />
          </h1>
          <p className="text-center text-base-content/60 mb-8 text-sm">
            <T es="Ingresa tu correo para recibir un enlace" en="Enter your email to receive a link" />
          </p>

          {message ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
              <T 
                es="Te hemos enviado un enlace de recuperación. Revisa tu bandeja de entrada." 
                en="We have sent you a recovery link. Check your inbox." 
              />
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-base-content/80">
                  <T es="Correo Electrónico" en="Email" />
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-light" 
                  placeholder="name@example.com"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 relative group px-8 py-3.5 rounded-xl font-medium text-white overflow-hidden transition-all flex items-center justify-center disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-primary opacity-90 group-hover:opacity-100 transition-opacity"></div>
                {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <span className="relative z-10"><T es="Enviar Enlace" en="Send Link" /></span>}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-base-content/60">
            <T es="¿Recordaste tu contraseña?" en="Remember your password?" />{' '}
            <Link href="/login" className="text-white hover:text-primary transition-colors font-medium">
              <T es="Inicia sesión" en="Log in" />
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
