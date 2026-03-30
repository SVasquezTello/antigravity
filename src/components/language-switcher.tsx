'use client'
import { useI18n } from './i18n-provider'

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  return (
    <div className="flex gap-2 bg-base-300/50 backdrop-blur-md p-1 rounded-full border border-white/5">
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${lang === 'es' ? 'bg-primary text-white shadow-lg' : 'text-base-content/70 hover:text-white'}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${lang === 'en' ? 'bg-primary text-white shadow-lg' : 'text-base-content/70 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  )
}
