'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { T } from '@/components/i18n-provider'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)

    // 1. Update password in Auth
    const { error: authError } = await supabase.auth.updateUser({ password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Clear the must_change_password flag in public.users
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ must_change_password: false }).eq('id', user.id)
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-base-300">
      <div className="mesh-gradient opacity-30" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="glass-card p-10 bg-white/[0.02] border-white/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">
              <T es="Actualizar Contraseña" en="Update Password" />
            </h1>
            <p className="text-white/40 text-sm mt-2">
              <T es="Es obligatorio cambiar tu clave para continuar" en="You must change your password to continue" />
            </p>
          </div>

          {success ? (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-center font-bold">
              <T es="¡Contraseña actualizada! Redirigiendo..." en="Password updated! Redirecting..." />
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">
                  <T es="Nueva Contraseña" en="New Password" />
                </label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:border-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">
                  <T es="Confirmar Contraseña" en="Confirm Password" />
                </label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:border-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center italic">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <T es="Actualizar Ahora" en="Update Now" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
