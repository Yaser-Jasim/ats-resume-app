'use client'
import { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
]

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, dir: 'ltr' })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('resemy_site_lang') : null
    if (saved) setLangState(saved)
  }, [])

  function setLang(code) {
    setLangState(code)
    if (typeof window !== 'undefined') localStorage.setItem('resemy_site_lang', code)
  }

  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}