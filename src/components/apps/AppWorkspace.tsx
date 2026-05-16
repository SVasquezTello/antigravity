'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, X, Copy, FileText, Code, Loader2, Download, ShieldCheck, Zap, Star, Sparkles, MessageCircle } from 'lucide-react'
import { FormFieldSchema } from './DynamicForm'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts'

interface AppWorkspaceProps {
  appId: string
  appSlug?: string
  currentExecutionId: string | null
  formSchema?: FormFieldSchema[]
  onSelect?: (executionId: string) => void
  fallbackResult?: any
}

export function AppWorkspace({ appId: _appId, appSlug, currentExecutionId, formSchema, fallbackResult }: AppWorkspaceProps) {
  void _appId;
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  const [execution, setExecution] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const responseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentExecutionId) {
      setExecution(null)
      return
    }

    const fetchExecution = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('app_executions')
        .select('*')
        .eq('id', currentExecutionId)
        .single()
      
      if (!error && data) {
        setExecution(data)
      }
      setLoading(false)
    }

    fetchExecution()

    const channel = supabase.channel(`execution_${currentExecutionId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'app_executions', 
        filter: `id=eq.${currentExecutionId}` 
      }, (payload) => {
        setExecution(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentExecutionId, supabase])

  const copyToClipboard = async (type: 'text' | 'markdown' | 'html') => {
    if (!responseRef.current) return
    
    let content = ''
    if (type === 'text') {
      content = responseRef.current.innerText
    } else if (type === 'markdown') {
      content = execution?.result?.markdown || ''
    } else if (type === 'html') {
      content = responseRef.current.innerHTML
    }

    try {
      await navigator.clipboard.writeText(content)
      toast({ 
        title: language === 'en' ? 'Copied' : 'Copiado', 
        type: 'success' 
      })
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToWhatsApp = () => {
    const text = `🚀 *Reporte de Inteligencia Antigravity*\n\nHe generado este análisis para ti:\n\n${result.substring(0, 500)}...\n\nGenerado en: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  const downloadAsPDF = async () => {
    if (!responseRef.current) return
    
    toast({ 
      title: language === 'en' ? 'Preparing Professional Report...' : 'Preparando Reporte Profesional...', 
      type: 'info' 
    })

    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).jsPDF

    try {
      // 1. Fetch Partner Branding
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user?.id).single()
      const { data: partner } = await supabase.from('partners').select('name, logo_url').eq('id', userData?.partner_id).single()

      const canvas = await html2canvas(responseRef.current, {
        scale: 3, // Ultra high res for business
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Add Brand Header
      pdf.setFillColor(248, 250, 252) // Light slate
      pdf.rect(0, 0, pdfWidth, 40, 'F')
      
      pdf.setFontSize(18)
      pdf.setTextColor(15, 23, 42)
      pdf.text(partner?.name || 'Antigravity Intelligence', 20, 25)
      
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text(`REPORT ID: ${currentExecutionId?.substring(0,12).toUpperCase()}`, 20, 32)
      pdf.text(new Date().toLocaleDateString(), pdfWidth - 40, 25)

      // Add Content
      const imgProps = pdf.getImageProperties(imgData)
      const contentWidth = pdfWidth - 40
      const contentHeight = (imgProps.height * contentWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 20, 50, contentWidth, contentHeight)
      
      // Footer
      pdf.setFontSize(7)
      pdf.text('CONFIDENTIAL BUSINESS INTELLIGENCE - POWERED BY ANTIGRAVITY ENGINE', pdfWidth / 2, pdfHeight - 10, { align: 'center' })
      
      pdf.save(`${partner?.name || 'Antigravity'}-Report-${currentExecutionId?.substring(0,8)}.pdf`)
      
      toast({ 
        title: language === 'en' ? 'Professional PDF Ready' : 'Reporte PDF Listo', 
        type: 'success' 
      })
    } catch (err) {
      console.error('PDF Error:', err)
      toast({ title: 'Error PDF', type: 'error' })
    }
  }

  if (!currentExecutionId) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-14 max-w-lg border-white/5 bg-white/[0.02]"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Zap className="w-12 h-12 text-primary/40 animate-pulse" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
            {language === 'en' ? 'Ready for Power?' : '¿Listo para el Poder?'}
          </h3>
          <p className="text-white/40 text-lg font-medium leading-relaxed">
            {language === 'en' 
              ? 'Enter your requirements on the left. Our Gemini engine is fueled and ready to generate premium content for you.' 
              : 'Ingresa tus requerimientos a la izquierda. Nuestro motor Gemini está listo para generar contenido premium para ti.'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (loading && !execution) {
    return (
      <div className="h-full flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const status = execution?.status || 'pending'
  const isGenerating = status === 'pending' || status === 'processing'
  const result = execution?.result?.markdown || fallbackResult?.markdown || ''

  return (
    <div className="space-y-8 pb-20">
      {/* Top Block: The Petition */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8 md:p-10 space-y-8 bg-white/[0.03] border-white/10"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/20 rounded-xl">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight">
              {language === 'en' ? 'Execution Details' : 'Detalles de Ejecución'}
            </h4>
          </div>
          <div className={`text-[10px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-full border ${
            status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-primary/10 border-primary/20 text-primary animate-pulse'
          }`}>
            {status}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(execution?.inputs || {}).map(([key, value]) => {
            const field = formSchema?.find(f => (f.id || f.name) === key)
            const label = field ? (language === 'en' ? field.label_en : field.label_es) : key
            
            return (
              <div key={key} className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group transition-all hover:bg-white/[0.05]">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-black">{label}</span>
                <div className="text-base text-white/90 font-bold">
                  {String(value || 'N/A')}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom Block: The Response */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
            <div className="p-2 bg-accent-pink/20 rounded-xl">
               <Star className="w-6 h-6 text-accent-pink" />
            </div>
            {language === 'en' ? 'Intelligence Output' : 'Resultado de Inteligencia'}
          </h4>
          
          <AnimatePresence>
            {status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-2"
              >
                <button 
                  onClick={() => copyToClipboard('markdown')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/50 hover:text-white transition-all shadow-xl"
                  title="Copy Markdown"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={shareToWhatsApp}
                  className="p-3 rounded-2xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-500 transition-all shadow-xl"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={downloadAsPDF}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white shadow-[0_10px_40px_rgba(124, 58, 237,0.4)] hover:bg-primary/90 transition-all font-black text-sm active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  {language === 'en' ? 'Download PDF Report' : 'Descargar Reporte PDF'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isGenerating ? (
          <div className="glass-card min-h-140 flex flex-col items-center justify-center p-20 space-y-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-28 h-28 mb-10">
                   <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                   <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin" />
                   <div className="absolute inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                   <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-primary animate-bounce-slow" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tighter">
                    {language === 'en' ? 'Forging Content...' : 'Forjando Contenido...'}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold">
                    Connected to Gemini Engine v2.0
                  </p>
                </div>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="glass-card border-red-500/30 bg-red-500/5 p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h5 className="text-2xl font-bold text-white uppercase tracking-tight">{language === 'en' ? 'Analysis Failed' : 'Análisis Fallido'}</h5>
            <p className="text-white/50 max-w-md mx-auto">{execution?.error_message}</p>
          </div>
        ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-report p-10 md:p-20 relative min-h-160"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
              
              <article 
                ref={responseRef}
                className="relative z-10 prose prose-slate prose-xl max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-primary prose-hr:border-slate-100"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              </article>

              {/* Premium Footer */}
              <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col items-center opacity-40">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">A</div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">ANTIGRAVITY</span>
                 </div>
                 <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400">
                    Intelligence Report Output
                 </p>
              </div>
            </motion.div>
        )}
      </div>
    </div>
  )
}
