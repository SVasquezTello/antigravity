'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Search,
  Filter,
  User,
  CreditCard,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminVouchersPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    const { data, error } = await supabase
      .from('payment_vouchers')
      .select('*, users(email, full_name), offers(name)')
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Error al cargar vouchers', type: 'error' })
    } else {
      setVouchers(data || [])
    }
    setLoading(false)
  }

  const handleApprove = async (voucher: any) => {
    setProcessingId(voucher.id)
    try {
      const response = await fetch('/api/admin/approve-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId: voucher.id })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al aprobar voucher')
      }

      toast({ title: 'Pago aprobado y plan activado', type: 'success' })
      fetchVouchers()
    } catch (e: any) {
      toast({ title: 'Error en aprobación', description: e.message, type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (voucherId: string) => {
    const reason = prompt('Motivo del rechazo:')
    if (!reason) return

    setProcessingId(voucherId)
    try {
      const { error } = await supabase
        .from('payment_vouchers')
        .update({ 
          status: 'rejected', 
          rejection_reason: reason,
          updated_at: new Date().toISOString() 
        })
        .eq('id', voucherId)

      if (error) throw error
      toast({ title: 'Voucher rechazado', type: 'info' })
      fetchVouchers()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className="p-10 animate-pulse text-white/20">Cargando tesorería...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administración</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">Validación de <span className="text-primary">Vouchers</span></h1>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-white">{vouchers.filter(v => v.status === 'pending').length} PENDIENTES</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {vouchers.length === 0 ? (
          <GlassCard className="p-20 text-center space-y-4">
             <AlertCircle className="w-12 h-12 text-white/10 mx-auto" />
             <p className="text-white/40 font-bold uppercase tracking-widest">No hay vouchers registrados aún</p>
          </GlassCard>
        ) : (
          vouchers.map((voucher) => (
            <motion.div key={voucher.id} layout>
              <GlassCard className={`p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 transition-all ${voucher.status === 'pending' ? 'border-amber-500/20' : ''}`}>
                 <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                    {/* Voucher Image Preview */}
                    <a href={voucher.voucher_url} target="_blank" className="relative group shrink-0">
                       <div className="w-24 h-32 rounded-xl bg-white/5 overflow-hidden border border-white/10 group-hover:border-primary transition-all">
                          <img src={voucher.voucher_url} alt="Voucher" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all">
                             <ExternalLink className="w-6 h-6 text-white" />
                          </div>
                       </div>
                    </a>

                    <div className="space-y-4 flex-1 text-center md:text-left">
                       <div className="flex items-center justify-center md:justify-start gap-3">
                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            voucher.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                            voucher.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {voucher.status}
                          </div>
                          <span className="text-[10px] text-white/20 font-bold">{new Date(voucher.created_at).toLocaleString()}</span>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Cliente
                             </p>
                             <h4 className="text-sm font-black text-white truncate">{voucher.users?.full_name || 'Sin nombre'}</h4>
                             <p className="text-[10px] text-white/40 truncate">{voucher.users?.email}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="w-3 h-3" /> Plan Solicitado
                             </p>
                             <h4 className="text-sm font-black text-primary uppercase italic">{voucher.offers?.name}</h4>
                             <p className="text-lg font-black text-white italic">S/ {voucher.amount}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {voucher.status === 'pending' && (
                   <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => handleReject(voucher.id)}
                        disabled={processingId === voucher.id}
                        className="flex-1 md:flex-none px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                         <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                      <button 
                        onClick={() => handleApprove(voucher)}
                        disabled={processingId === voucher.id}
                        className="flex-1 md:flex-none px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                      >
                         <CheckCircle className="w-4 h-4" /> Aprobar y Activar
                      </button>
                   </div>
                 )}
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
