'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'es' | 'vi'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

interface TranslationProviderProps {
  children: ReactNode
}

// Import translation files
import { translations } from '../translations'

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load language from localStorage on mount (client-side only)
  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem('nailnav-language') as Language
      if (savedLanguage && ['en', 'es', 'vi'].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      }
    }
  }, [isClient])

  // Save language to localStorage when changed (client-side only)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('nailnav-language', language)
    }
  }, [language, isClient])

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return the key if not found in any language
          }
        }
        break
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters in the translation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match
      })
    }

    return value
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}