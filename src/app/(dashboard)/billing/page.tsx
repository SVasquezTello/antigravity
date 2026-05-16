'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  CreditCard, 
  History, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ArrowRight,
  Loader2,
  Calendar,
  XCircle,
  FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientBillingPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [subscription, setSubscription] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBilling = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase.from('users').select('workspace_id').eq('id', user.id).single()
        
        // Fetch Vouchers (Pending/Rejected bank transfers)
        const { data: voucherData } = await supabase
          .from('payment_vouchers')
          .select('*, offer:offers(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (voucherData) setVouchers(voucherData)

        if (userData?.workspace_id) {
          // Fetch Subscriptions
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('*, offer:offers(*)')
            .eq('workspace_id', userData.workspace_id)
            .order('created_at', { ascending: false })
            .limit(1)
          if (subData) setSubscription(subData[0])

          // Fetch Transactions
          const { data: txData } = await supabase
            .from('transactions')
            .select('*')
            .eq('workspace_id', userData.workspace_id)
            .order('created_at', { ascending: false })
          if (txData) setTransactions(txData)
        }
      }
      setLoading(false)
    }
    fetchBilling()
  }, [supabase])

  const handleCancel = () => {
    toast({ 
      title: 'Redirecting to Customer Portal...', 
      description: 'You can manage your subscription there.',
      type: 'info' 
    })
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">{t('common.loading')}</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">{t('sidebar.financial_intelligence')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            {t('common.billing')} <span className="text-primary italic">& Plans</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
         {/* --- Main Content --- */}
         <div className="space-y-8">
            
            {/* --- Pending Vouchers Section --- */}
            {vouchers.some(v => v.status === 'pending') && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-500">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">{t('billing.pending_verification')}</h3>
                </div>
                {vouchers.filter(v => v.status === 'pending').map(voucher => (
                  <GlassCard key={voucher.id} className="p-6 border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <FileText className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-wider">{voucher.offer?.name}</p>
                        <p className="text-[10px] text-white/40 uppercase font-bold">{new Date(voucher.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white italic">S/ {voucher.amount}</p>
                      <p className="text-[9px] text-amber-500 font-black uppercase">{t('billing.pending_verification')}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* --- Active Subscription Card --- */}
            <GlassCard className={`p-10 border-none relative overflow-hidden group ${subscription?.status === 'active' ? 'bg-primary/5' : 'bg-white/5'}`}>
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
               
               <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Current Status</p>
                        <div className="flex items-center gap-3">
                           <h2 className="text-4xl font-black text-white uppercase">{subscription?.offer?.name || 'Free Tier'}</h2>
                           {subscription?.status === 'active' ? (
                             <span className="px-3 py-1 bg-green-500/20 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Active
                             </span>
                           ) : subscription && (
                             <span className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/20 flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> {subscription.status}
                             </span>
                           )}
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-white">$ {subscription?.offer?.prices[0]?.amount || 0}</p>
                        <p className="text-[10px] text-white/30 uppercase font-black">/ Month</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Next Billing Date
                        </p>
                        <p className="text-white font-bold">{subscription ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3" /> Plan Benefits
                        </p>
                        <p className="text-white font-bold">{subscription?.offer?.grants?.credits || 0} Monthly Credits</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                     <button onClick={handleCancel} className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:invert transition-all flex items-center justify-center gap-2">
                        Manage Payment Methods
                        <ExternalLink className="w-4 h-4" />
                     </button>
                     {subscription?.status === 'active' && (
                        <button className="px-8 py-4 bg-white/5 text-white/40 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20">
                           Cancel Subscription
                        </button>
                     )}
                  </div>
               </div>
            </GlassCard>

            {/* --- Transaction History --- */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-white/20">
                  <History className="w-5 h-5" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Transaction History</h3>
               </div>
               <GlassCard className="p-0 overflow-hidden border-white/5">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/5">
                           <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                           <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Description</th>
                           <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                           <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {transactions.length === 0 ? (
                          <tr><td colSpan={4} className="p-12 text-center text-[10px] font-black text-white/10 uppercase italic">No transactions found</td></tr>
                        ) : transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                             <td className="p-6 text-xs text-white/40">{new Date(tx.created_at).toLocaleDateString()}</td>
                             <td className="p-6">
                                <p className="text-sm font-medium text-white">{tx.type} - {tx.processor}</p>
                             </td>
                             <td className="p-6 uppercase">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${tx.status === 'succeeded' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>
                                   {tx.status}
                                 </span>
                             </td>
                             <td className="p-6 text-right font-black text-white">${tx.amount}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </GlassCard>
            </div>
         </div>

         {/* --- Summary Sidebar --- */}
         <div className="space-y-8">
            <GlassCard className="p-8 space-y-6 border-white/10">
               <h3 className="text-xs font-black text-white uppercase tracking-widest">Credit Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-white/40">Allocated Credits</span>
                     <span className="text-sm font-bold text-white">{subscription?.offer?.grants?.credits || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-white/40">Bonus Credits</span>
                     <span className="text-sm font-bold text-white">0</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-black text-primary uppercase">Total Available</span>
                     <span className="text-lg font-black text-white italic">150</span>
                  </div>
               </div>
               <button className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  Purchase Top-up
               </button>
            </GlassCard>
         </div>
      </div>
    </div>
  )
}

