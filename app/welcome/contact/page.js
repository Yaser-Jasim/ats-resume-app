'use client'
import { useState } from 'react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'

export default function ContactPage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].contact

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.errorGeneric)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />
      <section className="max-w-lg mx-auto px-6 py-20">
        <FadeIn>
          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.label}</p>
          <h1 className="font-display text-4xl text-ink mb-4">{t.title}</h1>
          <p className="text-gray-600 mb-10">{t.sub}</p>

          {sent ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-green-800 text-sm">
              {t.sentMsg}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6">
              <div>
                <label className="text-sm font-medium text-ink">{t.nameLabel}</label>
                <input required value={name} onChange={e => setName(e.target.value)}
                       className="w-full mt-1.5 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">{t.emailLabel}</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                       className="w-full mt-1.5 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">{t.messageLabel}</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
                          className="w-full mt-1.5 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={sending}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-50">
                {sending ? t.sending : t.send}
              </button>
            </form>
          )}
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  )
}