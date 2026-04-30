'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  UserPlus, 
  Mail, 
  Shield, 
  Trash2, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  Users 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TeamPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [members, setMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase.from('users').select('client_id').eq('id', user.id).single()
    if (userData?.client_id) {
      // Fetch current members
      const { data: mData } = await supabase
        .from('users')
        .select('*')
        .eq('client_id', userData.client_id)
      if (mData) setMembers(mData)

      // Fetch pending invitations
      const { data: iData } = await supabase
        .from('invitations')
        .select('*')
        .eq('client_id', userData.client_id)
        .eq('status', 'pending')
      if (iData) setInvitations(iData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [supabase])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users').select('client_id').eq('id', user?.id).single()
      
      const token = Math.random().toString(36).substring(2, 15)
      
      const { error } = await supabase.from('invitations').insert({
        email,
        client_id: userData?.client_id,
        invited_by: user?.id,
        token
      })

      if (error) throw error
      
      toast({ title: language === 'en' ? 'Invitation sent' : 'Invitación enviada', type: 'success' })
      setEmail('')
      fetchData()
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setIsInviting(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading team...</div>

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Users className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Workspace</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Team <span className="text-primary italic">Management</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
        {/* Left: Invite Form */}
        <section className="space-y-6">
           <GlassCard className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <UserPlus className="w-5 h-5 text-primary" />
                 {language === 'en' ? 'Invite Member' : 'Invitar Miembro'}
              </h3>
              <form onSubmit={handleInvite} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                       <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-primary outline-none transition-all text-sm"
                          placeholder="staff@company.com"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Initial Credits (Optional)</label>
                    <input 
                       type="number" 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-white" 
                       placeholder="0"
                    />
                 </div>
                 <button 
                    disabled={isInviting}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                 >
                    {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {language === 'en' ? 'Send Invitation' : 'Enviar Invitación'}
                 </button>
              </form>
           </GlassCard>

           <AnimatePresence>
             {invitations.length > 0 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2 mb-4">Pending Invitations</p>
                   <div className="space-y-3">
                      {invitations.map(inv => (
                        <div key={inv.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                                 <Clock className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-white/60 font-medium truncate max-w-[120px]">{inv.email}</span>
                           </div>
                           <button className="text-white/20 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </section>

        {/* Right: Members List */}
        <section className="space-y-6">
           <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/5">
                          <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest">User</th>
                          <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Role</th>
                          <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Credit Limit</th>
                          <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Usage</th>
                          <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {members.map(member => (
                         <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                     {member.first_name?.[0] || member.email[0].toUpperCase()}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-white">{member.first_name || 'Staff Member'}</p>
                                     <p className="text-[10px] text-white/30 font-medium">{member.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase">
                                  <Shield className="w-3 h-3 text-primary" />
                                  {member.role === 'client_owner' ? 'Owner' : 'Staff'}
                               </div>
                            </td>
                            <td className="p-6">
                               <input 
                                  type="number" 
                                  defaultValue={member.credit_limit || 0}
                                  disabled={member.role === 'client_owner'}
                                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:border-primary disabled:opacity-0"
                               />
                            </td>
                            <td className="p-6 text-xs text-white/40">
                               {member.credit_usage || 0} execs
                            </td>
                            <td className="p-6 text-right">
                               <button disabled={member.role === 'client_owner'} className="p-2 text-white/20 hover:text-red-500 transition-colors disabled:opacity-0 disabled:cursor-default">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </GlassCard>
        </section>
      </div>
    </div>
  )
}
