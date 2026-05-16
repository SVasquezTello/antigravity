'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { DynamicForm } from './DynamicForm'
import { AutofillBadges } from './AutofillBadges'
import { AppHistory } from './AppHistory'
import { AppWorkspace } from './AppWorkspace'
import { 
  Sparkles, History, Send, Layers, Settings, ChevronRight, Pencil, Video, 
  Search, FileText, Layout, Lightbulb, Users, Mail, Share2, Tv, Briefcase,
  Presentation, ClipboardList, Copy, TrendingUp, ShieldCheck, Target, Map, Zap, MessageCircle,
  Grid, BookOpen, Star, Mic, RefreshCw, Shield, Home
} from 'lucide-react'

// Map labels to icons, with safe fallbacks
const ICON_MAP: Record<string, any> = {
  Sparkles, Pencil, Video, Search, FileText, Layout, Lightbulb, Users, Mail, Share2, 
  Youtube: Tv, Tv, Briefcase, Presentation, ClipboardList, Copy, TrendingUp, 
  ShieldCheck, Target, Map, Zap, MessageCircle, Grid, BookOpen, Star, Mic, RefreshCw, Shield, Home
}

interface MicroAppRunnerProps {
  appSlug: string
}

export function MicroAppRunner({ appSlug }: MicroAppRunnerProps) {
  const { language } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form')
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackResult, setFallbackResult] = useState<any>(null)
  
  const workspaceRef = useRef<HTMLDivElement>(null)

  const IconComp = app?.icon && ICON_MAP[app.icon] ? ICON_MAP[app.icon] : Sparkles

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const normalizedSlug = appSlug.toLowerCase()
        const { data, error: fetchError } = await supabase
          .from('micro_apps')
          .select('*')
          .eq('slug', normalizedSlug)
          .single()
        
        if (fetchError) {
          console.error('MicroAppRunner: Fetch error', fetchError)
          setError(fetchError.message)
        } else if (data) {
          setApp(data)
        }
      } catch (err: any) {
        console.error('MicroAppRunner: Exception', err)
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchApp()
  }, [appSlug, supabase])

  const handleFormSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSlug, inputs: values })
      })
      
      const data = await response.json()
      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Generation failed');
        throw new Error(errorMsg);
      }

      if (data.executionId) {
        if (data.result) {
          setFallbackResult(data.result);
        } else {
          setFallbackResult(null);
        }
        setCurrentExecutionId(data.executionId);
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHistorySelect = (id: string) => {
    setCurrentExecutionId(id)
    if (window.innerWidth < 768) {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20 bg-transparent">
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse rounded-full" />
             <div className="w-24 h-24 border-[3px] border-white/5 border-t-primary rounded-full animate-spin relative z-10"></div>
             <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="space-y-2 text-center">
             <p className="font-black tracking-[0.5em] uppercase text-[10px] text-white">
               {language === 'en' ? 'Synchronizing Neurals...' : 'Sincronizando Neuronales...'}
             </p>
             <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Antigravity V1.0 - Industrial Engine</p>
          </div>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <GlassCard className="p-12 text-center border-red-500/20 max-w-md">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">
            {language === 'en' ? 'Application Error' : 'Error de Sistema'}
          </h2>
          <p className="text-white/40 text-xs font-medium leading-relaxed">No se ha podido localizar el núcleo de la aplicación solicitada. Por favor, verifica la integridad del enlace.</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col md:flex-row w-full gap-4 md:gap-8 overflow-y-auto md:overflow-hidden p-6 pb-4">
      {/* Left Column: Form / History Orchestration */}
      <div className="w-full md:w-[320px] lg:w-[450px] flex flex-col gap-6 h-auto md:h-full shrink-0">
        {/* Header Block */}
        <div className="glass-card p-8 space-y-6 border-glow relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all duration-700" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-[2rem] bg-linear-to-br from-primary to-accent-pink flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20">
              <IconComp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-shimmer transition-all">
                {language === 'en' ? app.name_en : app.name_es}
              </h1>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-2">
                 AI Forge <span className="text-primary italic">Protocol</span>
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-white/[0.03] rounded-[1.5rem] border border-white/5 mt-4 relative z-10">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'form' 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 border border-primary/20 scale-[1.02]' 
                  : 'text-white/20 hover:text-white/40'
              }`}
            >
              <Send className="w-4 h-4" />
              {language === 'en' ? 'Engine' : 'Motor'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'history' 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 border border-primary/20 scale-[1.02]' 
                  : 'text-white/20 hover:text-white/40'
              }`}
            >
              <History className="w-4 h-4" />
              {language === 'en' ? 'Logs' : 'Registros'}
            </button>
          </div>
        </div>

        {/* Content Block */}
        <div className="flex-1 glass-card p-8 overflow-y-auto space-y-8 custom-scrollbar border-glow bg-white/[0.01]">
          {activeTab === 'form' ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Input Presets</h3>
                 <AutofillBadges 
                  presets={app.autofill_presets || []} 
                  onSelect={(vals) => setFormValues(vals)}
                  activeValues={formValues}
                />
              </div>
              
              {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse">
                  <Shield className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Neural Parameters</h3>
                 <DynamicForm 
                  schema={app.form_schema || []} 
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  initialValues={formValues}
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
               <AppHistory 
                appId={app.id} 
                onSelect={handleHistorySelect}
                activeExecutionId={currentExecutionId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Execution Workspace */}
      <div 
        ref={workspaceRef}
        className="flex-1 flex flex-col h-auto md:h-full md:overflow-hidden relative min-h-100 md:min-h-0 shrink-0 mb-10 md:mb-0"
      >
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar md:pr-4">
            <AppWorkspace 
              appId={app.id} 
              appSlug={appSlug}
              currentExecutionId={currentExecutionId} 
              formSchema={app.form_schema || []}
              fallbackResult={fallbackResult}
            />
        </div>
      </div>
    </div>
  )
}
