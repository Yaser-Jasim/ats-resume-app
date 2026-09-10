'use client'
import { useState } from 'react'
import Link from 'next/link'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { Menu, X, Languages } from 'lucide-react'
import { useLanguage, LANGUAGES } from './LanguageContext'
import { CONTENT } from './marketingContent'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, dir } = useLanguage()
  const t = CONTENT[lang].nav

  const links = [
    { label: t.about, href: '/welcome/about' },
    { label: t.services, href: '/welcome/services' },
    { label: t.pricing, href: '/account/plans' },
    { label: t.help, href: '/help' },
    { label: t.contact, href: '/welcome/contact' },
  ]

  return (
    <header dir={dir} className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/welcome" className="flex items-center gap-2">
          <ResemyLogo size={30} />
          <span className="font-display text-lg font-medium text-ink">Resemy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Languages className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              dir="ltr"
              className="border rounded-lg pl-7 pr-3 py-1.5 text-sm bg-white"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
            {t.getStarted}
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-ink">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-3 bg-white">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-gray-700">
              {l.label}
            </Link>
          ))}
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            dir="ltr"
            className="border rounded-lg px-3 py-2 text-sm bg-white w-full"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <Link href="/" className="block text-center bg-brand text-white rounded-xl py-2.5 text-sm font-medium">
            {t.getStarted}
          </Link>
        </div>
      )}
    </header>
  )
}