'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { Menu, X, Languages, ChevronDown } from 'lucide-react'
import { useLanguage, LANGUAGES } from './LanguageContext'
import { CONTENT } from './marketingContent'

function ContactDropdown({ contactLabel, feedbackLabel, dir }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-ink transition-colors"
      >
        {contactLabel}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-2 ${dir === 'rtl' ? 'right-0' : 'left-0'} bg-white border border-gray-100 rounded-xl shadow-[0_8px_24px_-8px_rgba(20,36,61,0.2)] w-44 py-1.5 text-sm z-50`}
        >
          <Link href="/welcome/contact" onClick={() => setOpen(false)} className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">
            {contactLabel}
          </Link>
          <Link href="/feedback" onClick={() => setOpen(false)} className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">
            {feedbackLabel}
          </Link>
        </div>
      )}
    </div>
  )
}

export default function MarketingNav() {
  const [open, setOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const { lang, setLang, dir } = useLanguage()
  const t = CONTENT[lang].nav

  const links = [
    { label: t.about, href: '/welcome/about' },
    { label: t.services, href: '/welcome/services' },
    { label: t.forRecruiters, href: '/welcome#recruiters' },
    { label: t.pricing, href: '/account/plans' },
    { label: t.help, href: '/help' },
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
          <ContactDropdown contactLabel={t.contact} feedbackLabel={t.feedback} dir={dir} />
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
            <Link href="/app"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(234,88,12,0.5)] hover:from-orange-500 hover:to-orange-700 active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(234,88,12,0.5)] transition-all">
            {t.getStarted}
          </Link>
        </div>

          <button onClick={() => { setOpen(!open); setContactOpen(false) }} className="md:hidden text-ink">
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
                    <div>
            <button
              onClick={() => setContactOpen(!contactOpen)}
              className="flex items-center justify-between w-full text-sm text-gray-700"
            >
              {t.contact}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${contactOpen ? 'rotate-180' : ''}`} />
            </button>
            {contactOpen && (
              <div className="mt-2 ms-3 space-y-2">
                <Link href="/welcome/contact" onClick={() => setOpen(false)} className="block text-sm text-gray-600">
                  {t.contact}
                </Link>
                <Link href="/feedback" onClick={() => setOpen(false)} className="block text-sm text-gray-600">
                  {t.feedback}
                </Link>
              </div>
            )}
          </div>
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