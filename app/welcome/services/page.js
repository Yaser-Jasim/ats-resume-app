'use client'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import { FileText, Mail, Users, ShieldCheck, MessageSquareText, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'

export default function ServicesPage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].services

  const candidateServices = [
    { icon: Sparkles, title: t.c1t, desc: t.c1d },
    { icon: ShieldCheck, title: t.c2t, desc: t.c2d },
    { icon: Mail, title: t.c3t, desc: t.c3d },
    { icon: FileText, title: t.c4t, desc: t.c4d },
    { icon: MessageSquareText, title: t.c5t, desc: t.c5d },
  ]

  const hrServices = [
    { icon: Users, title: t.h1t, desc: t.h1d },
    { icon: ShieldCheck, title: t.h2t, desc: t.h2d },
    { icon: FileText, title: t.h3t, desc: t.h3d },
  ]

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />
      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.label}</p>
          <h1 className="font-display text-4xl text-ink mb-4">{t.title}</h1>
          <p className="text-gray-600 max-w-2xl mb-14">{t.sub}</p>
        </FadeIn>

        <FadeIn>
          <h2 className="font-display text-2xl text-ink mb-6">{t.candidatesTitle}</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {candidateServices.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(20,36,61,0.25)] transition-all duration-300">
                <s.icon className="w-6 h-6 text-brand mb-3" />
                <p className="font-semibold text-ink mb-1">{s.title}</p>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <h2 className="font-display text-2xl text-ink mb-6">{t.hrTitle}</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {hrServices.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(20,36,61,0.25)] transition-all duration-300">
                <s.icon className="w-6 h-6 text-brand mb-3" />
                <p className="font-semibold text-ink mb-1">{s.title}</p>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <Link href="/app" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
            {t.cta} →
          </Link>
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  )
}