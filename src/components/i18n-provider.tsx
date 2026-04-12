'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'es' | 'en'

interface I18nContextProps {
  lang: Language
  setLang: (lang: Language) => void
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('i18n-lang') as Language
    if (stored && (stored === 'es' || stored === 'en')) {
      setLang(stored)
    } else {
      const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('en') ? 'en' : 'es'
      setLang(browserLang)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('i18n-lang', newLang)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function T({ es, en }: { es: string; en: string }) {
  const { lang } = useI18n()
  return <>{lang === 'en' ? en : es}</>
}
