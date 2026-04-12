'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { Zap, Activity, CheckCircle, XCircle, ChevronDown, ChevronUp, Copy, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WebhooksClientProps {
  plans: any[]
  initialLogs: any[]
}

const FIRST_NAMES = ['Carlos', 'Ana', 'Luis', 'María', 'Pedro', 'Sofía', 'Jorge', 'Laura', 'Andrés', 'Valentina']
const LAST_NAMES = ['García', 'López', 'Martínez', 'Rodríguez', 'Hernández', 'Pérez', 'González', 'Sánchez', 'Torres', 'Ramírez']

export function WebhooksClient({ plans, initialLogs }: WebhooksClientProps) {
  const { language } = useTranslation()
  const { toast } = useToast()
  
  const [logs, setLogs] = useState(initialLogs)
  const [loading, setLoading] = useState(false)
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const [formData, setFormData] = useState({
    event: 'payment.completed',
    first_name: '',
    last_name: '',
    email: '',
    plan: plans[0]?.slug || '',
    source: 'simulator',
    transaction_id: '',
    amount: plans[0]?.price_monthly || 0,
    currency: 'USD'
  })

  // generate random
  const handleQuickGenerate = () => {
    const rFName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const rLName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const rEmail = `demo_${Math.random().toString(36).substring(2,7)}@gmail.com`
    const rPlan = plans[Math.floor(Math.random() * plans.length)] || { slug: 'basic', price_monthly: 29 }
    const rTid = `sim_${Math.random().toString(36).substring(2,10)}`

    setFormData({
      event: 'payment.completed',
      first_name: rFName,
      last_name: rLName,
      email: rEmail,
      plan: rPlan.slug,
      source: 'simulator',
      transaction_id: rTid,
      amount: rPlan.price_monthly,
      currency: 'USD'
    })
    setResult(null)
  }

  const handleSimulate = async () => {
    setLoading(true)
    setResult(null)
    
    const payload = {
      event: formData.event,
      customer: {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      },
      plan: formData.plan,
      source: formData.source,
      transaction_id: formData.transaction_id,
      amount: Number(formData.amount),
      currency: formData.currency
    }

    try {
      const res = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      setResult({ status: res.status, data })
      
      if (res.ok) {
        toast({ title: language === 'en' ? 'Simulation successful' : 'Simulación exitosa', type: 'success' })
        const newLog = {
          id: Date.now().toString(),
          source: formData.source,
          event_type: formData.event,
          raw_payload: payload,
          normalized_payload: payload,
          status: 'processed',
          created_at: new Date().toISOString()
        }
        setLogs([newLog, ...logs].slice(0, 20))
      } else {
        toast({ title: language === 'en' ? 'Simulation failed' : 'Simulación fallida', type: 'error' })
        const newLog = {
          id: Date.now().toString(),
          source: formData.source,
          event_type: formData.event,
          raw_payload: payload,
          normalized_payload: payload,
          status: 'failed',
          error_message: data.error,
          created_at: new Date().toISOString()
        }
        setLogs([newLog, ...logs].slice(0, 20))
      }
    } catch (err: unknown) {
      toast({ title: 'Error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: language === 'en' ? 'Copied to clipboard' : 'Copiado al portapapeles', type: 'success' })
  }

  const plansList = plans.map(p => p.slug).join(', ')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">{language === 'en' ? 'Webhooks' : 'Webhooks'}</h1>
        <p className="text-white/60 mt-2">
          {language === 'en' 
            ? 'Simulate payments and manage processor integration' 
            : 'Simula pagos y gestiona la integración de procesadores'}
        </p>
      </div>

      {/* Simulator Section */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {language === 'en' ? 'Webhook Simulator' : 'Simulador de Webhook'}
          </h2>
          <button 
            onClick={handleQuickGenerate}
            className="flex items-center gap-2 text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors border border-white/10"
          >
            <Zap className="w-4 h-4 text-accent-warm" />
            ⚡ Quick Generate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Event Type</label>
            <select 
              value={formData.event}
              onChange={(e) => setFormData({...formData, event: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-hidden focus:border-primary transition-all"
            >
              <option value="payment.completed">payment.completed</option>
              <option value="subscription.cancelled">subscription.cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">First Name</label>
            <Input 
              placeholder="First Name" 
              value={formData.first_name} 
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Last Name</label>
            <Input 
              placeholder="Last Name" 
              value={formData.last_name} 
              onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Email</label>
            <Input 
              placeholder="Email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Plan</label>
            <select 
              value={formData.plan}
              onChange={(e) => {
                const p = plans.find(pl => pl.slug === e.target.value)
                setFormData({...formData, plan: e.target.value, amount: p ? p.price_monthly : 0})
              }}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-hidden focus:border-primary transition-all"
            >
              {plans.map(p => (
                <option key={p.id} value={p.slug}>{p.slug} (${p.price_monthly})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Source</label>
            <Input 
              placeholder="Source" 
              value={formData.source} 
              onChange={(e) => setFormData({...formData, source: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Transaction ID</label>
            <Input 
              placeholder="Transaction ID" 
              value={formData.transaction_id} 
              onChange={(e) => setFormData({...formData, transaction_id: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Amount</label>
            <Input 
              placeholder="Amount" 
              type="number"
              value={formData.amount} 
              onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Currency</label>
            <Input 
              placeholder="Currency" 
              value={formData.currency} 
              onChange={(e) => setFormData({...formData, currency: e.target.value})} 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <GlowButton 
            variant="primary" 
            className="w-full"
            onClick={handleSimulate} 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Simulating...</span>
            ) : (
              <span className="flex items-center gap-2">🚀 {language === 'en' ? 'Simulate Payment' : 'Simular Pago'}</span>
            )}
          </GlowButton>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-2xl border bg-black/40",
              result.status === 200 ? "border-green-500/30" : "border-red-500/30"
            )}
          >
            <div className="flex items-start gap-4">
              {result.status === 200 ? (
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              )}
              <div className="space-y-2 w-full">
                <h3 className="font-bold text-white">
                  {result.status === 200 ? 'Success' : 'Error'}
                </h3>
                {result.status === 200 ? (
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-white/40 mb-1">User ID</p>
                      <p className="text-white font-mono break-all">{result.data.user_id}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-white/40 mb-1">Plan Assigned/Removed</p>
                      <p className="text-white capitalize">{result.data.plan_assigned || result.data.plan_removed}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-white/40 mb-1">Is New User?</p>
                      <p className="text-white">{result.data.is_new_user ? 'Yes' : 'No'}</p>
                    </div>
                    {result.data.generated_password && (
                      <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                        <p className="text-green-500/60 mb-1">Generated Password</p>
                        <p className="text-green-400 font-mono font-bold tracking-widest">{result.data.generated_password}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-200 font-mono text-sm">
                    {result.data.error || 'Unknown error'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* Integration Guide Section */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-accent-cyan" />
          {language === 'en' ? '🔗 Payment Processor Integration' : '🔗 Integración con Procesadores de Pago'}
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="font-bold text-white/80">1. {language === 'en' ? 'Your Webhook URL' : 'Tu URL de Webhook'}</h3>
            <div className="relative group">
              <pre className="bg-black/40 border border-white/10 p-4 rounded-xl text-primary font-mono text-sm overflow-x-auto">
                https://your-domain.vercel.app/api/webhooks/payment
              </pre>
              <button 
                onClick={() => handleCopy('https://your-domain.vercel.app/api/webhooks/payment')}
                className="absolute right-3 top-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-4 h-4 text-white/50 hover:text-white" />
              </button>
            </div>
            <p className="text-sm text-white/40 italic flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {language === 'en' ? 'Replace `your-domain` with your Vercel domain' : 'Reemplaza `your-domain` con tu dominio de Vercel'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white/80">2. {language === 'en' ? 'Required JSON Payload' : 'Payload JSON Requerido'}</h3>
            <div className="relative group">
              <pre className="bg-black/40 border border-white/10 p-4 rounded-xl text-white/80 font-mono text-xs overflow-x-auto">
{`{
  "event": "payment.completed",
  "customer": {
    "email": "buyer@example.com",
    "first_name": "Carlos",
    "last_name": "García"
  },
  "plan": "professional",
  "source": "stripe",
  "transaction_id": "txn_abc123",
  "amount": 97.00,
  "currency": "USD"
}`}
              </pre>
              <button 
                onClick={() => handleCopy(`{\n  "event": "payment.completed",\n  "customer": {\n    "email": "buyer@example.com",\n    "first_name": "Carlos",\n    "last_name": "García"\n  },\n  "plan": "professional",\n  "source": "stripe",\n  "transaction_id": "txn_abc123",\n  "amount": 97.00,\n  "currency": "USD"\n}`)}
                className="absolute right-3 top-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-4 h-4 text-white/50 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-3 bg-primary/5 p-6 rounded-2xl border border-primary/20">
            <h3 className="font-bold text-primary">3. {language === 'en' ? 'Field Mapping Instructions' : 'Instrucciones de Mapeo'}</h3>
            <p className="text-white/60 leading-relaxed text-sm">
              {language === 'en' 
                ? 'Any payment processor (Stripe, PayPal, MercadoPago, Hotmart, ThriveCart) can send webhooks to this URL. You need to use an automation tool like Make.com, Zapier, or n8n to convert the processor\'s payload to our standard format.'
                : 'Cualquier procesador de pagos (Stripe, PayPal, MercadoPago, Hotmart, ThriveCart) puede enviar webhooks a esta URL. Necesitas usar una herramienta de automatización como Make.com, Zapier, o n8n para convertir el payload del procesador a nuestro formato estándar.'}
            </p>
          </div>

          <div className="space-y-3 overflow-x-auto">
            <h3 className="font-bold text-white/80">4. {language === 'en' ? 'Field Mapping Table' : 'Tabla de Mapeo de Campos'}</h3>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-white/40 uppercase text-xs">
                <tr>
                  <th className="p-4 rounded-tl-xl">{language === 'en' ? 'Our Field' : 'Nuestro Campo'}</th>
                  <th className="p-4">{language === 'en' ? 'What to Map' : 'Qué Mapear'}</th>
                  <th className="p-4 rounded-tr-xl">{language === 'en' ? 'Example' : 'Ejemplo'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr><td className="p-4 font-mono">event</td><td className="p-4">Payment event type</td><td className="p-4 font-mono">payment.completed</td></tr>
                <tr><td className="p-4 font-mono">customer.email</td><td className="p-4">Buyer email</td><td className="p-4 font-mono">buyer@email.com</td></tr>
                <tr><td className="p-4 font-mono">customer.first_name</td><td className="p-4">Buyer first name</td><td className="p-4 font-mono">Carlos</td></tr>
                <tr><td className="p-4 font-mono">customer.last_name</td><td className="p-4">Buyer last name</td><td className="p-4 font-mono">García</td></tr>
                <tr><td className="p-4 font-mono">plan</td><td className="p-4">Plan slug</td><td className="p-4 font-mono">professional</td></tr>
                <tr><td className="p-4 font-mono">source</td><td className="p-4">Processor name</td><td className="p-4 font-mono">stripe</td></tr>
                <tr><td className="p-4 font-mono">transaction_id</td><td className="p-4">Transaction ID</td><td className="p-4 font-mono">pi_1abc</td></tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white/80">5. {language === 'en' ? 'Security & Best Practices' : 'Seguridad y Buenas Prácticas'}</h3>
            <div className="space-y-3 text-sm text-white/60">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Header Security (x-webhook-secret)</strong>
                {language === 'en' 
                  ? 'To secure your webhook in production, set the WEBHOOK_SECRET environment variable in Vercel and send the x-webhook-secret header with that value from your automation.'
                  : 'Para proteger tu webhook en producción, configura la variable de entorno WEBHOOK_SECRET en Vercel y envía el header x-webhook-secret con ese valor desde tu automatización.'}
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Supported Events</strong>
                <ul className="list-disc pl-5 space-y-1 mt-2 font-mono text-xs text-white/50">
                  <li><span className="text-white">payment.completed</span> — {language === 'en' ? 'Creates or updates user and assigns plan' : 'Crea o actualiza el usuario y asigna el plan'}</li>
                  <li><span className="text-white">subscription.cancelled</span> — {language === 'en' ? 'Removes user plan' : 'Remueve el plan del usuario'}</li>
                </ul>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-l-primary">
                <strong className="text-white block mb-1">Pro Tip: Plan Slugs</strong>
                {language === 'en' 
                  ? `Your current plan slugs are: [${plansList}]. Make sure the webhook plan field matches one of these slugs exactly.`
                  : `Tus slugs de planes actuales son: [${plansList}]. Asegúrate de que el campo plan del webhook coincida exactamente con uno de estos slugs.`}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Logs Section */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{language === 'en' ? 'Webhook Logs' : 'Logs de Webhook'}</h2>
        </div>
        
        {logs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-white/10 m-8 rounded-2xl flex flex-col items-center">
            <Activity className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40">
              {language === 'en' 
                ? 'No webhook events recorded yet. Use the simulator above to test.' 
                : 'Aún no hay eventos de webhook. Usa el simulador de arriba para probar.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {logs.map((log) => {
                    const expanded = expandedLogId === log.id
                    const mail = log.normalized_payload?.customer?.email || 'N/A'
                    const pl = log.event_type === 'subscription.cancelled' ? 'Removed' : (log.normalized_payload?.plan || 'N/A')
                    
                    return (
                      <React.Fragment key={log.id}>
                        <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setExpandedLogId(expanded ? null : log.id)}>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              log.source === 'stripe' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                              log.source === 'simulator' ? "bg-primary/10 text-primary border border-primary/20" :
                              log.source === 'self-service' ? "bg-accent-pink/10 text-accent-pink border border-accent-pink/20" :
                              "bg-white/10 text-white border border-white/20"
                            )}>
                              {log.source || 'unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">{log.event_type}</td>
                          <td className="px-6 py-4 text-white/70 truncate max-w-[150px]">{mail}</td>
                          <td className="px-6 py-4 text-white/70 capitalize">{pl}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              log.status === 'processed' ? "bg-green-500/10 text-green-400" :
                              log.status === 'failed' ? "bg-red-500/10 text-red-400" :
                              "bg-white/10 text-white/50"
                            )}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white" />}
                          </td>
                        </tr>
                        {expanded && (
                          <tr>
                            <td colSpan={7} className="p-0 border-b-0">
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-black/60 border-y border-white/5"
                              >
                                <div className="p-6">
                                  {log.error_message && (
                                    <div className="mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-mono text-sm inline-block">
                                      Error: {log.error_message}
                                    </div>
                                  )}
                                  <h4 className="text-xs font-bold text-white/40 uppercase mb-2">Raw Payload</h4>
                                  <pre className="bg-black border border-white/10 p-4 rounded-xl overflow-x-auto text-xs font-mono text-white/70">
                                    {JSON.stringify(log.raw_payload, null, 2)}
                                  </pre>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
