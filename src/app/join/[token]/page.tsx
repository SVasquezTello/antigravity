'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  UserPlus, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Mail,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function InvitationJoinPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [invite, setInvite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      // 23.5 Validación segura con Token
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          workspaces:workspace_id(name),
          partners:partner_id(name)
        `)
        .eq('token', params.token)
        .eq('status', 'pending')
        .single()
      
      if (data) {
        setInvite(data)
        setEmail(data.email)
      }
      setLoading(false)
    }
    validateToken()
  }, [params.token])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: 'Team Member' } }
    })

    if (!authError && authData.user) {
      // 2. Consume Invite (Backend would normally do this via triggers, but we simulate)
      await supabase.from('invitations').update({ status: 'accepted' }).eq('id', invite.id)
      
      // 3. Link user to workspace & role
      await supabase.from('users').update({ 
        role: invite.role, 
        workspace_id: invite.workspace_id,
        partner_id: invite.partner_id
      }).eq('id', authData.user.id)

      router.push('/dashboard')
    }
    setIsSubmitting(false)
  }

  if (loading) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/20 uppercase tracking-[0.5em] font-black italic">Validating Cipher...</div>

  if (!invite) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/40 uppercase font-black italic">Invitation Expired or Invalid</div>

  return (
    <div className="min-h-screen bg-[#050014] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_70%)]">
      <div className="max-w-xl w-full">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="p-10 md:p-14 space-y-10 border-primary/20">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20">
                     <UserPlus className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase italic">Access Invitation</h1>
                  <div className="flex items-center justify-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] bg-white/5 py-3 rounded-2xl border border-white/5">
                     <Building2 className="w-4 h-4 text-primary" />
                     <span>Joining: <span className="text-white">{invite.workspaces?.name}</span></span>
                  </div>
               </div>

               <p className="text-center text-xs font-medium text-white/50 leading-relaxed italic">
                  You have been invited to join this enterprise intelligence workspace as a <span className="text-primary font-black uppercase not-italic">{invite.role}</span>. Secure your account below to begin.
               </p>

               <form onSubmit={handleJoin} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Authorized Email</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input type="email" value={email} disabled className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white/30 cursor-not-allowed" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Create Your Security Key</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                           type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full bg-white/5 border border-primary/20 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none" 
                           placeholder="••••••••••••"
                        />
                     </div>
                  </div>

                  <button 
                    type="submit" disabled={isSubmitting}
                    className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                     Join Workspace Access
                  </button>
               </form>

               <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-white/20" />
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Enterprise Secured by Antigravity protocol</p>
               </div>
            </GlassCard>
         </motion.div>
      </div>
    </div>
  )
}
