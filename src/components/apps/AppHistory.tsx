'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { History, FileText, Clock, Trash2, Loader2, Sparkles, AlertCircle } from 'lucide-react'

interface AppHistoryProps {
  appId: string
  onSelect: (executionId: string) => void
  activeExecutionId: string | null
}

export function AppHistory({ appId, onSelect, activeExecutionId }: AppHistoryProps) {
  const { language } = useTranslation()
  const supabase = createClient()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appId) return

    const fetchHistory = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('app_executions')
        .select('*')
        .eq('app_id', appId)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setHistory(data)
      }
      setLoading(false)
    }

    fetchHistory()
  }, [appId, supabase])

  const deleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await supabase
      .from('app_executions')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setHistory(prev => prev.filter(h => h.id !== id))
    }
  }

  const getSummary = (inputs: any) => {
    if (!inputs) return language === 'en' ? 'Empty' : 'Vacío'
    
    // Priority keys
    const priorityKeys = ['topic', 'title', 'query', 'name', 'subject', 'keywords']
    for (const key of priorityKeys) {
      if (inputs[key] && typeof inputs[key] === 'string') return inputs[key]
    }
    
    // Fallback: Longest string
    let longest = ''
    for (const val of Object.values(inputs)) {
      if (typeof val === 'string' && val.length > longest.length) {
        longest = val
      }
    }
    
    return longest || (language === 'en' ? 'Execution details' : 'Detalles de ejecución')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/30 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">
          {language === 'en' ? 'Loading history...' : 'Cargando historial...'}
        </span>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 glass-card bg-white/2 border-white/5 opacity-40">
        <History className="w-10 h-10 mb-2" />
        <h5 className="font-bold text-white uppercase text-xs tracking-widest">
          {language === 'en' ? 'No History Yet' : 'Sin Historial'}
        </h5>
        <p className="text-xs max-w-[200px]">
          {language === 'en' 
            ? 'Your AI generated creations will appear here.' 
            : 'Tus creaciones generadas por IA aparecerán aquí.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {history.map((item) => {
        const isActive = item.id === activeExecutionId
        const summary = getSummary(item.inputs)
        const date = new Date(item.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
          month: 'short',
          day: 'numeric'
        })
        const time = new Date(item.created_at).toLocaleTimeString(language === 'en' ? 'en-US' : 'es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(item.id)
              }
            }}
            tabIndex={0}
            role="button"
            className={`group w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive 
                ? 'bg-linear-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 ring-1 ring-primary/20 shadow-lg shadow-black/20' 
                : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className={`p-2.5 rounded-xl transition-colors shrink-0 ${
              isActive ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
            }`}>
              {item.status === 'completed' ? <FileText className="w-5 h-5" /> : 
               item.status === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
               <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/30">
                  <Clock className="w-3 h-3" />
                  {date} • {time}
                </div>
                {item.status === 'completed' && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                  </div>
                )}
              </div>
              
              <h5 className="text-sm font-semibold text-white/90 line-clamp-2 leading-tight group-hover:text-white transition-colors" title={summary}>
                {summary}
              </h5>
            </div>

            <button
              onClick={(e) => deleteHistory(item.id, e)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-white/0 group-hover:text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus-visible:text-white/30 focus-visible:opacity-100"
              aria-label={language === 'en' ? 'Delete history item' : 'Eliminar elemento del historial'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {isActive && (
              <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
