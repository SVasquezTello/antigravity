'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, X, Copy, FileText, Code, Loader2, Download, ShieldCheck, Zap, Star, Sparkles } from 'lucide-react'
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
}

export function AppWorkspace({ appId: _appId, appSlug, currentExecutionId, formSchema }: AppWorkspaceProps) {
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

  const downloadAsPDF = async () => {
    if (!responseRef.current) return
    
    toast({ 
      title: language === 'en' ? 'Preparing PDF...' : 'Preparando PDF...', 
      type: 'info' 
    })

    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).jsPDF

    try {
      const canvas = await html2canvas(responseRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`microapps-hub-report-${currentExecutionId?.substring(0,8)}.pdf`)
      
      toast({ 
        title: language === 'en' ? 'PDF Downloaded' : 'PDF Descargado', 
        type: 'success' 
      })
    } catch (err) {
      console.error('PDF Error:', err)
      toast({ 
        title: 'Error PDF', 
        type: 'error' 
      })
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
  const result = execution?.result?.markdown || ''

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
                  onClick={downloadAsPDF}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white shadow-[0_10px_40px_rgba(124,58,237,0.4)] hover:bg-primary/90 transition-all font-black text-sm active:scale-95"
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
            className="bg-white rounded-[3rem] p-10 md:p-20 shadow-[-20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-160 border border-white/20"
          >
            {/* Report Header Visual */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute top-10 right-10 text-slate-100 opacity-20 pointer-events-none select-none">
                <Sparkles className="w-32 h-32" />
            </div>

            {/* Visual Data Section (Conditional for Audience Analyst) */}
            {appSlug === 'audience-analyst' && status === 'completed' && (
              <div className="relative z-10 mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Market Distribution</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Gen Z', val: 45 },
                        { name: 'Millennials', val: 80 },
                        { name: 'Gen X', val: 30 },
                        { name: 'Boomers', val: 15 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="val" radius={[10, 10, 0, 0]}>
                          {[0,1,2,3].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 ? '#7c3aed' : '#c4b5fd'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">User Interest Peak</h5>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High', value: 400 },
                            { name: 'Medium', value: 300 },
                            { name: 'Low', value: 300 },
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#7c3aed" />
                          <Cell fill="#a78bfa" />
                          <Cell fill="#ede9fe" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <article 
              ref={responseRef}
              className="relative z-10 prose prose-slate prose-xl max-w-none prose-headings:text-slate-950 prose-headings:font-black prose-p:text-slate-700 prose-p:leading-loose prose-strong:text-primary prose-hr:border-slate-100"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </article>

            {/* Premium Footer */}
            <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col items-center opacity-30">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                  <span className="text-slate-400 font-bold">M</span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                  MicroApps Hub Intelligence Report
               </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
