'use client'
import { useI18n } from '@/components/i18n-provider'

export function useTranslation() {
  const { lang, setLang, t } = useI18n()
  return { language: lang, setLanguage: setLang, t }
}
