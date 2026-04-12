'use client'

import React, { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/ToastProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { Mail, Server, User, UserCircle, Key, AtSign, CheckCircle2, AlertTriangle, Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function EmailConfigPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    from_email: '',
    from_name: '',
    test_recipient: ''
  })

  useEffect(() => {
    async function loadData() {
      // Get Admin User Info
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setAdminEmail(user.email || '')
        setAdminName(
          user.user_metadata?.first_name 
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
            : 'Admin'
        )
        setForm(f => ({ ...f, test_recipient: user.email || '' }))
      }

      // Get Settings
      const { data: settings } = await supabase
        .from('smtp_settings')
        .select('*')
        .limit(1)
        .single()
        
      if (settings) {
        setForm(f => ({
          ...f,
          host: settings.host || '',
          port: settings.port ? String(settings.port) : '',
          username: settings.username || '',
          password: '', // Do NOT set password, show dots if we wanted but keep empty placeholder
          from_email: settings.from_email || '',
          from_name: settings.from_name || ''
        }))
        setIsVerified(settings.is_verified)
        setVerifiedAt(settings.verified_at)
      }
      setLoading(false)
    }
    
    // Note: If you haven't run the DB migration in Supabase SQL editor, this will throw an error to the console 
    // and settings will remain empty. It will not break the page.
    loadData().catch(console.error)
  }, [supabase])

  const handleProviderClick = (provider: string) => {
    let updates = { host: '', port: '587', username: adminEmail }
    if (provider === 'SendGrid') {
      updates = { host: 'smtp.sendgrid.net', port: '587', username: 'apikey' }
    } else if (provider === 'Gmail') {
      updates = { host: 'smtp.gmail.com', port: '587', username: adminEmail }
    } else if (provider === 'Mailgun') {
      updates = { host: 'smtp.mailgun.org', port: '587', username: adminEmail }
    } else if (provider === 'Amazon SES') {
      updates = { host: 'email-smtp.us-east-1.amazonaws.com', port: '587', username: adminEmail }
    }

    setForm(f => ({
      ...f,
      ...updates,
      from_email: f.from_email || adminEmail,
      from_name: f.from_name || adminName
    }))
  }

  const handleTestAndSave = async () => {
    if (!form.host || !form.port || !form.username || !form.from_email || !form.test_recipient) {
      toast({ title: language === 'en' ? 'Please fill in all required fields.' : 'Por favor completa los campos requeridos.', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast({ title: `Email enviado exitosamente y configuración guardada. ${data.smtp_response || ''}`, type: 'success' })
        setIsVerified(true)
        setVerifiedAt(new Date().toISOString())
        // Keep the form values but clear password to prevent accidental re-save overwrites if typed
        setForm(f => ({ ...f, password: '' }))
      } else {
        toast({ title: data.message || 'Error configuring SMTP', type: 'error' })
        setIsVerified(false)
      }
    } catch (err: any) {
      toast({ title: err.message || 'Unexpected Error', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-white/50 animate-pulse">Loading SMTP Configuration...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-entrance">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          {language === 'en' ? 'Email Configuration' : 'Configuración de Email'}
        </h1>
        <p className="text-white/60">
          {language === 'en' 
            ? 'Configure your SMTP settings to enable welcome emails and notifications' 
            : 'Configura tu SMTP para habilitar emails de bienvenida y notificaciones'}
        </p>
      </div>

      {/* Status Banner */}
      {isVerified ? (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold">{language === 'en' ? 'SMTP Configured and Verified' : 'SMTP Configurado y Verificado'}</p>
            {verifiedAt && <p className="text-sm opacity-80">{language === 'en' ? 'Last verified:' : 'Última verificación:'} {new Date(verifiedAt).toLocaleString()}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold">{language === 'en' ? 'SMTP Not Configured' : 'SMTP No Configurado'}</p>
            <p className="text-sm opacity-80">{language === 'en' ? 'Welcome emails are disabled until an SMTP provider is configured.' : 'Los emails de bienvenida están desactivados hasta que se configure y verifique un proveedor HTTP.'}</p>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <GlassCard className="p-8 space-y-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white shrink-0">
            {language === 'en' ? 'SMTP Provider Settings' : 'Configuración de Proveedor SMTP'}
          </h2>
          
          <div className="flex flex-wrap items-center gap-2">
            {['SendGrid', 'Gmail', 'Mailgun', 'Amazon SES'].map(provider => (
              <button
                key={provider}
                onClick={() => handleProviderClick(provider)}
                className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'Host' : 'Servidor (Host)'}</label>
             <Input 
               icon={<Server size={18}/>} 
               value={form.host} 
               onChange={(e) => setForm({...form, host: e.target.value})} 
               placeholder="smtp.sendgrid.net" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'Port' : 'Puerto'}</label>
             <Input 
               type="number"
               icon={<Server size={18}/>} 
               value={form.port} 
               onChange={(e) => setForm({...form, port: e.target.value})} 
               placeholder="587" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'Username' : 'Usuario'}</label>
             <Input 
               icon={<User size={18}/>} 
               value={form.username} 
               onChange={(e) => setForm({...form, username: e.target.value})} 
               placeholder="apikey" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'Password' : 'Contraseña (App Password)'}</label>
             <Input 
               type="password"
               icon={<Key size={18}/>} 
               value={form.password} 
               onChange={(e) => setForm({...form, password: e.target.value})} 
               placeholder="••••••••••••••" 
             />
             <p className="text-xs text-white/30 uppercase mt-1">
               {language === 'en' ? 'Leave empty to keep existing password' : 'Dejar en blanco para mantener la contraseña actual'}
             </p>
          </div>
          <div className="space-y-2 h-px bg-white/5 col-span-1 md:col-span-2 my-2" />
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'From Email' : 'Email de Envío'}</label>
             <Input 
               icon={<AtSign size={18}/>} 
               value={form.from_email} 
               onChange={(e) => setForm({...form, from_email: e.target.value})} 
               placeholder="noreply@miportal.com" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-bold text-white/50">{language === 'en' ? 'From Name' : 'Nombre Remitente'}</label>
             <Input 
               icon={<UserCircle size={18}/>} 
               value={form.from_name} 
               onChange={(e) => setForm({...form, from_name: e.target.value})} 
               placeholder="MicroApps Hub" 
             />
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
           <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
             <Send className="w-4 h-4 text-primary" />
             {language === 'en' ? 'Verification' : 'Verificación'}
           </h3>
           <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <Input 
                  value={form.test_recipient} 
                  onChange={(e) => setForm({...form, test_recipient: e.target.value})} 
                  placeholder="admin@ejemplo.com" 
                />
              </div>
              <GlowButton onClick={handleTestAndSave} disabled={submitting} className="w-full sm:w-auto shrink-0 whitespace-nowrap px-8">
                 {submitting 
                    ? (language === 'en' ? 'Testing...' : 'Probando...') 
                    : (language === 'en' ? '🧪 Send Test Email' : '🧪 Enviar Email de Prueba')}
              </GlowButton>
           </div>
           <p className="text-xs text-white/40 text-center sm:text-left mt-2 italic">
              {language === 'en' ? 'Saving settings requires a successful test email.' : 'No hay botón "Guardar". La única forma de guardar es enviando un email de prueba exitosamente.'}
           </p>
        </div>
      </GlassCard>
    </div>
  )
}
