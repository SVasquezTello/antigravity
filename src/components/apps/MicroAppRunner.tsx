'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { DynamicForm } from './DynamicForm'
import { AutofillBadges } from './AutofillBadges'
import { AppHistory } from './AppHistory'
import { AppWorkspace } from './AppWorkspace'
import { Sparkles, History, Send, Layers, Settings, ChevronRight, Pencil, Video, Search, FileText, Layout, Lightbulb, Users, Mail, Share2, Tv, Briefcase } from 'lucide-react'

// Map labels to icons, with safe fallbacks
const ICON_MAP: Record<string, any> = {
  Sparkles,
  Pencil,
  Video,
  Search,
  FileText,
  Layout,
  Lightbulb,
  Users,
  Mail,
  Share2,
  Youtube: Tv,
  Tv,
  Briefcase
}

interface MicroAppRunnerProps {
  appSlug: string
}

export function MicroAppRunner({ appSlug }: MicroAppRunnerProps) {
  const { language } = useTranslation()
  const supabase = createClient()
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
      const { data, error } = await supabase
        .from('micro_apps')
        .select('*')
        .eq('slug', appSlug)
        .single()
      
      if (!error && data) {
        setApp(data)
      }
      setLoading(false)
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
      <div className="h-full flex items-center justify-center p-20 text-white/40">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="font-bold tracking-widest uppercase text-xs">
            {language === 'en' ? 'Preparing Application...' : 'Preparando Aplicación...'}
          </p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <div className="glass-card p-12 text-center border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'en' ? 'Application Not Found' : 'Aplicación no Encontrada'}
          </h2>
          <p className="text-white/50">{appSlug}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col md:flex-row w-full gap-4 md:gap-6 lg:gap-8 overflow-y-auto md:overflow-hidden p-6 pb-4">
      {/* Left Column: Form / History Orchestration */}
      <div className="w-full md:w-[320px] lg:w-[400px] flex flex-col gap-4 h-auto md:h-full shrink-0">
        {/* Header Block */}
        <div className="glass-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary via-accent-pink to-accent-warm flex items-center justify-center shadow-lg shadow-primary/20">
              <IconComp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                {language === 'en' ? app.name_en : app.name_es}
              </h1>
              <p className="text-xs text-white/40 font-medium line-clamp-1">
                {language === 'en' ? app.description_en : app.description_es}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mt-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'form' 
                  ? 'bg-white/10 text-white shadow-inner border border-white/10' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {language === 'en' ? 'Form' : 'Formulario'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history' 
                  ? 'bg-white/10 text-white shadow-inner border border-white/10' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              {language === 'en' ? 'History' : 'Historial'}
            </button>
          </div>
        </div>

        {/* Content Block */}
        <div className="flex-1 glass-card p-4 md:p-6 overflow-y-auto space-y-6 custom-scrollbar border-white/10">
          {activeTab === 'form' ? (
            <>
              <AutofillBadges 
                presets={app.autofill_presets || []} 
                onSelect={(vals) => setFormValues(vals)}
                activeValues={formValues}
              />
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-bounce-slow">
                  ⚠️ {error}
                </div>
              )}
              <DynamicForm 
                schema={app.form_schema || []} 
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                initialValues={formValues}
              />
            </>
          ) : (
            <AppHistory 
              appId={app.id} 
              onSelect={handleHistorySelect}
              activeExecutionId={currentExecutionId}
            />
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
