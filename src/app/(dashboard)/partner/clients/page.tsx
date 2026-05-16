'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Users, 
  Search, 
  ExternalLink, 
  Power, 
  Activity,
  BarChart,
  Eye,
  Loader2,
  Building
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function PartnerClientsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()
  
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user.id).single()
      if (userData?.partner_id) {
        const { data } = await supabase
          .from('workspaces')
          .select('*')
          .eq('partner_id', userData.partner_id)
          .order('name', { ascending: true })
        if (data) setClients(data)
      }
      setLoading(false)
    }
    fetchClients()
  }, [supabase])

  const handleSuplantar = (clientId: string, clientName: string) => {
    localStorage.setItem('is_impersonating', 'true')
    localStorage.setItem('impersonating_user_name', clientName)
    localStorage.setItem('impersonating_user_id', clientId)
    
    toast({ 
      title: `Entering Support Mode`, 
      description: `Viewing workspace as ${clientName}`,
      type: 'success' 
    })
    
    router.push('/apps')
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName) return
    
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user?.id).single()
    
    if (userData?.partner_id) {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: newClientName,
          partner_id: userData.partner_id,
          status: 'active'
        })
        .select()
        .single()
      
      if (!error) {
        setClients([data, ...clients])
        setNewClientName('')
        setIsAddModalOpen(false)
        toast({ title: 'Workspace Created', description: `${newClientName} is now ready.`, type: 'success' })
      } else {
        toast({ title: 'Error', description: error.message, type: 'error' })
      }
    }
    setIsSaving(false)
  }

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading Clients...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Building className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Portfolio Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Client <span className="text-primary italic">Workspaces</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary outline-none"
              />
           </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Building className="w-5 h-5" />
            </button>
        </div>
      </header>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0A001F] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">New Workspace</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <Power className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                
                <form onSubmit={handleAddClient} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Client / Company Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all"
                    />
                  </div>
                  
                  <button 
                    disabled={isSaving || !newClientName}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Workspace'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-8 space-y-6 group hover:border-primary/40 transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                    <Building className="w-6 h-6" />
                 </div>
                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                    client.status === 'active' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'
                 }`}>
                    {client.status || 'Active'}
                 </span>
              </div>

              <div>
                 <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">ID: {client.id.substring(0, 8)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase mb-1">Users</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-3 h-3 text-primary" /> 12</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase mb-1">Usage</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><Activity className="w-3 h-3 text-primary" /> 450</p>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button 
                  onClick={() => handleSuplantar(client.id, client.name)}
                  className="flex-1 py-3 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                    <Eye className="w-4 h-4" />
                    Support
                 </button>
                 <button className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                    <Power className="w-4 h-4" />
                 </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
