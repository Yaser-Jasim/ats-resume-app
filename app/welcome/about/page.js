'use client'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'

export default function AboutPage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].about

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />
      <section className="max-w-3xl mx-auto px-6 py-20">
        <FadeIn>
          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.label}</p>
          <h1 className="font-display text-4xl text-ink mb-6">{t.title}</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">{t.p1}</p>
          <p className="text-gray-700 mb-4 leading-relaxed">{t.p2}</p>
          <p className="text-gray-700 leading-relaxed">{t.p3}</p>
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  )
}