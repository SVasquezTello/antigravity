'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  X, 
  Copy, 
  Check, 
  Upload, 
  Image as ImageIcon,
  ShieldCheck,
  Building2,
  QrCode,
  Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/ToastProvider'
import { useTranslation } from '@/hooks/useTranslation'

interface BankTransferModalProps {
  isOpen: boolean
  onClose: () => void
  plan: any
}

export function BankTransferModal({ isOpen, onClose, plan }: BankTransferModalProps) {
  const { t, language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const bankAccounts = [
    { 
      bank: 'BCP Soles', 
      account: '19105588770020', 
      cci: '00219110558877002054', 
      owner: 'SAUL DAVID VASQUEZ TELLO',
      type: 'Ahorros'
    },
    { 
      bank: 'Yape Directo', 
      account: '943 428 947', 
      owner: 'SAUL DAVID VASQUEZ TELLO',
      type: 'Celular'
    }
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: t('billing.attach_voucher'), type: 'error' })
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // 1. Subir imagen a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vouchers')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('vouchers').getPublicUrl(fileName)

      // 2. Crear registro en payment_vouchers
      const { data: voucherInsert, error: dbError } = await supabase
        .from('payment_vouchers')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: plan.prices[0]?.amount,
          bank_name: 'Transferencia Bancaria',
          voucher_url: publicUrl,
          status: 'pending'
        })
        .select()
        .single()

      if (dbError || !voucherInsert) throw dbError || new Error('No se pudo registrar el voucher')

      // 3. Activar automáticamente el plan llamando al API de aprobación
      try {
        const approveRes = await fetch('/api/admin/approve-voucher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voucherId: voucherInsert.id })
        })
        
        const approveData = await approveRes.json()
        
        if (approveRes.ok && approveData.success) {
          toast({ 
            title: language === 'es' ? '¡Pago Verificado al Instante!' : 'Payment Verified Instantly!',
            description: language === 'es' 
              ? 'Tu plan premium y acceso a las micro-apps han sido activados automáticamente.' 
              : 'Your premium plan and access to micro-apps have been automatically activated.',
            type: 'success' 
          })
          
          // Recargar la página para actualizar el estado del plan del usuario en el dashboard
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          throw new Error(approveData.error || 'Failed to auto-approve')
        }
      } catch (approveErr: any) {
        console.warn('Auto-activation failed, falling back to manual validation:', approveErr.message)
        // Fallback en caso falle la activación automática (ej. red lenta): queda en pendiente para revisión manual
        toast({ 
          title: t('billing.pending_verification'), 
          description: t('billing.checking_vouchers'),
          type: 'success' 
        })
      }
      onClose()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl relative z-10"
          >
            <GlassCard className="p-8 md:p-10 border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                <header className="space-y-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Building2 className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('billing.direct_payment')}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('billing.bank_transfer')}</h2>
                  <p className="text-white/40 text-xs font-medium">{t('billing.payment_instruction')}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Accounts */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('billing.available_accounts')}</h4>
                    <div className="space-y-3">
                      {bankAccounts.map((acc, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 group hover:bg-white/[0.05] transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{acc.type}</span>
                               <span className="text-xs font-black text-white italic">{acc.bank}</span>
                            </div>
                            {acc.bank.includes('Yape') ? <QrCode className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-white/20" />}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center justify-between gap-2">
                               <code className="text-xs text-white/80 font-mono tracking-tighter">{acc.account}</code>
                               <button onClick={() => handleCopy(acc.account, `acc-${i}`)} className="p-1.5 rounded-lg bg-white/5 text-primary hover:bg-primary hover:text-white transition-all">
                                 {copied === `acc-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                               </button>
                             </div>
                             {acc.cci && (
                               <div className="flex items-center justify-between gap-2 opacity-40 hover:opacity-100 transition-opacity">
                                 <code className="text-[9px] text-white font-mono">CCI: {acc.cci}</code>
                                 <button onClick={() => handleCopy(acc.cci!, `cci-${i}`)} className="text-white/40 hover:text-primary">
                                   {copied === `cci-${i}` ? <Check className="w-2 h-2" /> : <Copy className="w-2 h-2" />}
                                 </button>
                               </div>
                             )}
                          </div>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest border-t border-white/5 pt-2">{acc.owner}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voucher Upload */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('billing.attach_voucher')}</h4>
                    <label className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden ${preview ? 'border-primary/50' : 'border-white/10 hover:border-white/30'}`}>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      
                      {preview ? (
                        <>
                          <img src={preview} alt="Voucher" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <ImageIcon className="w-8 h-8 text-white" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">{t('billing.change_image')}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-white/20 group-hover:text-primary transition-colors" />
                          <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('billing.upload_instruction')}</p>
                            <p className="text-[9px] text-white/20 uppercase mt-1">{t('billing.max_size')}</p>
                          </div>
                        </>
                      )}
                    </label>

                    <button 
                      onClick={handleSubmit}
                      disabled={loading || !file}
                      className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      {t('billing.confirm_deposit')}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

