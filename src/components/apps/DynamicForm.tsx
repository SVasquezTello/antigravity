'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Input } from '@/components/ui/Input'
import { Check, X } from 'lucide-react'

export interface FormFieldSchema {
  id?: string
  name?: string
  label_es: string
  label_en: string
  type: 'text' | 'textarea' | 'select' | 'toggle'
  options_es?: string[]
  options_en?: string[]
  placeholder_es?: string
  placeholder_en?: string
  required?: boolean
}

interface DynamicFormProps {
  schema: FormFieldSchema[]
  onSubmit: (values: Record<string, any>) => void
  isSubmitting?: boolean
  initialValues?: Record<string, any>
}

export function DynamicForm({ schema, onSubmit, isSubmitting, initialValues }: DynamicFormProps) {
  const { language } = useTranslation()
  const [values, setValues] = useState<Record<string, any>>({
    responseLanguage: 'Español'
  })

  // Autofill update: Spread initialValues last to overwrite
  useEffect(() => {
    if (initialValues) {
      setValues(prev => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  const resolveId = (field: FormFieldSchema) => field.id || field.name || ''

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.map((field) => {
        const id = resolveId(field)
        const label = language === 'en' ? field.label_en : field.label_es
        const placeholder = language === 'en' ? field.placeholder_en : field.placeholder_es

        return (
          <div key={id} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-white/70">
              {label} {field.required && <span className="text-accent-pink">*</span>}
            </label>

            {field.type === 'textarea' && (
              <textarea
                value={values[id] || ''}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={placeholder}
                required={field.required}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-32 resize-none"
              />
            )}

            {field.type === 'text' && (
              <Input
                value={values[id] || ''}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={placeholder}
                required={field.required}
                className="bg-white/5 border-white/10"
              />
            )}

            {field.type === 'select' && (
              <select
                value={values[id] || ''}
                onChange={(e) => handleChange(id, e.target.value)}
                required={field.required}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="" disabled className="bg-base-900">{placeholder || (language === 'en' ? 'Select...' : 'Seleccionar...')}</option>
                {field.options_es?.map((opt, i) => (
                  <option key={i} value={opt} className="bg-base-900">
                    {language === 'en' ? field.options_en?.[i] || opt : opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'toggle' && (
              <button
                type="button"
                onClick={() => handleChange(id, values[id] === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  values[id] === 'true' ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    values[id] === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
          </div>
        )
      })}

      {/* Response Language Radio Group */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
        <label className="text-sm font-medium text-white/70">
          {language === 'en' ? 'Response Language' : 'Idioma de Respuesta'}
        </label>
        <div className="flex gap-4">
          {['Español', 'English'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleChange('responseLanguage', lang)}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                values.responseLanguage === lang ? 'border-primary' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {values.responseLanguage === lang && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <span className={`text-sm transition-colors ${
                values.responseLanguage === lang ? 'text-white' : 'text-white/50 group-hover:text-white/80'
              }`}>{lang}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-linear-to-r from-primary to-accent-pink hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 mt-4 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {language === 'en' ? 'Generating...' : 'Generando...'}
          </>
        ) : (
          language === 'en' ? 'Generate Content' : 'Generar Contenido'
        )}
      </button>
    </form>
  )
}
