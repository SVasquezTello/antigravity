'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Search, 
  Command as CommandIcon, 
  Zap, 
  Settings, 
  Users, 
  Wallet, 
  Layout, 
  X,
  ArrowRight,
  Sparkles,
  History,
  FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export function CommandPalette() {
  const router = useRouter()
  const { language, t } = useTranslation()
  const supabase = createClient()
  
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // 1. Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 2. Search Logic
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchEverything = async () => {
      // Search Apps
      const { data: apps } = await supabase
        .from('micro_apps')
        .select('name_es, name_en, slug, icon')
        .or(`name_es.ilike.%${query}%,name_en.ilike.%${query}%,slug.ilike.%${query}%`)
        .limit(5)
      
      const formattedApps = (apps || []).map(a => ({
        type: 'app',
        label: language === 'es' ? a.name_es : a.name_en,
        description: `Lanzar Solución: ${a.slug}`,
        icon: Zap,
        link: `/apps/${a.slug}`
      }))

      // Search Actions
      const actions = [
        { type: 'action', label: 'Ajustes de Perfil', icon: Settings, link: '/settings', keywords: ['perfil', 'settings'] },
        { type: 'action', label: 'Billetera Partner', icon: Wallet, link: '/partner/wallet', keywords: ['saldo', 'dinero', 'pago'] },
        { type: 'action', label: 'Mis Clientes', icon: Users, link: '/partner/clients', keywords: ['onboarding', 'workspace'] },
        { type: 'action', label: 'Marketplace', icon: Layout, link: '/apps', keywords: ['tienda', 'store'] }
      ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.keywords.some(k => k.includes(query.toLowerCase())))

      setResults([...formattedApps, ...actions])
      setSelectedIndex(0)
    }

    const timeout = setTimeout(searchEverything, 200)
    return () => clearTimeout(timeout)
  }, [query, language, supabase])

  const handleSelect = (item: any) => {
    router.push(item.link)
    setIsOpen(false)
    setQuery('')
  }

  // 3. Navigation within results
  const handleNav = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    }
  }, [results, selectedIndex])

  return (
    <>
      {/* Floating Trigger Hint */}
      <div className="fixed bottom-8 right-8 hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/20 uppercase tracking-widest backdrop-blur-md z-40 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
         <CommandIcon className="w-3 h-3" /> + K para buscar
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a]/90 border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                 <Search className="w-5 h-5 text-primary" />
                 <input 
                   autoFocus
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyDown={handleNav}
                   placeholder="Busca aplicaciones, herramientas o configuraciones..."
                   className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/10"
                 />
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-white/20">
                    ESC
                 </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                 {results.length > 0 ? (
                   <div className="p-2 space-y-1">
                      {results.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIndex === i ? 'bg-primary text-white' : 'text-white/40 hover:bg-white/5'}`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${selectedIndex === i ? 'bg-white/20 text-white' : 'bg-white/5 text-primary'}`}>
                                 <item.icon className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                 <p className="text-sm font-bold">{item.label}</p>
                                 <p className={`text-[10px] font-medium uppercase tracking-widest ${selectedIndex === i ? 'text-white/60' : 'text-white/20'}`}>
                                    {item.type}
                                 </p>
                              </div>
                           </div>
                           <ChevronRight className={`w-4 h-4 transition-transform ${selectedIndex === i ? 'translate-x-1' : 'opacity-0'}`} />
                        </button>
                      ))}
                   </div>
                 ) : query ? (
                   <div className="p-20 text-center space-y-4">
                      <Sparkles className="w-10 h-10 text-white/5 mx-auto" />
                      <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">No se encontraron resultados para "{query}"</p>
                   </div>
                 ) : (
                   <div className="p-8 space-y-6">
                      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Accesos Rápidos</h3>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { label: 'Marketplace', icon: Layout, link: '/apps' },
                           { label: 'Historial', icon: History, link: '/notifications' },
                           { label: 'ROI Financiero', icon: Zap, link: '/analytics/roi' },
                           { label: 'Soporte Técnico', icon: FileText, link: '/support' }
                         ].map((item, i) => (
                           <button 
                             key={i} onClick={() => handleSelect(item)}
                             className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group"
                           >
                              <div className="p-2 bg-white/5 rounded-lg text-white/20 group-hover:text-primary transition-colors">
                                 <item.icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <footer className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                 <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> Navegar</span>
                    <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 rotate-90" /> Seleccionar</span>
                 </div>
                 <p className="italic text-primary/40">Powered by Antigravity Core</p>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
