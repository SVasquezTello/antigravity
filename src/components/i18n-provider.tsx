'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

type Language = 'es' | 'en'
const dictionaries: Record<Language, any> = { en, es }

interface I18nContextProps {
  lang: Language
  setLang: (lang: Language) => void
  t: (path: string) => string
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('i18n-lang') as Language
    if (stored && dictionaries[stored]) {
      setLang(stored)
    } else {
      // Default to 'es' for this project
      setLang('es')
    }
  }, [])

  // 24.1 Translation Engine with Deep Path Support
  const t = useCallback((path: string): string => {
    try {
      const keys = path.split('.')
      let result = dictionaries[lang]
      
      for (const key of keys) {
        result = result[key]
        if (!result) break
      }
      
      // Fallback logic
      if (!result) {
        let fallback = dictionaries['en']
        for (const key of keys) {
           fallback = fallback[key]
           if (!fallback) break
        }
        return fallback || path
      }
      
      return result
    } catch (e) {
      return path
    }
  }, [lang])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('i18n-lang', newLang)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}

export function T({ path, en, es }: { path?: string; en?: string; es?: string }) {
  const { lang, t } = useI18n()
  if (path) return <>{t(path)}</>
  return <>{lang === 'es' ? es : en}</>
}
