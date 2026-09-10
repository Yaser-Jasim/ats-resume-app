'use client'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import CountUp from '@/components/marketing/CountUp'
import ScoreBadge from '@/components/ScoreBadge'
import { Upload, Download, Sparkles, Mail, Users, ShieldCheck, MessageSquareText, FileText } from 'lucide-react'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'

export default function WelcomePage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].home

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <span className="inline-block text-xs font-medium text-brand bg-mist rounded-full px-3 py-1 mb-4">
            {t.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-4">
            {t.headline1} <span className="text-brand">{t.headline2}</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">{t.sub}</p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/app" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
              {t.ctaPrimary} →
            </Link>
            <Link href="/welcome/services" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-ink bg-white border border-gray-200 hover:bg-gray-50 transition-all">
              {t.ctaSecondary}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-sm">
            <div>
              <p className="font-display text-2xl text-ink">{t.stat1Value}</p>
              <p className="text-xs text-gray-500">{t.stat1Label}</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">{t.stat2Value}</p>
              <p className="text-xs text-gray-500">{t.stat2Label}</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink"><CountUp to={6} /></p>
              <p className="text-xs text-gray-500">{t.stat3Label}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="relative max-w-sm mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(20,36,61,0.35)] rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="/images/hero-photo.jpg" alt={t.heroImgAlt} className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-8 -right-6 bg-white rounded-xl shadow-[0_15px_35px_-10px_rgba(20,36,61,0.4)] border border-gray-100 p-3 -rotate-3">
              <ScoreBadge label="ATS score" value={91} color="green" />
            </div>
          </div>
        </FadeIn>
      </section>

            <section className="bg-gradient-to-br from-navy-light to-ink py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-3">{t.globalTitle}</h2>
            <p className="text-gray-300">{t.globalSub}</p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.problemLabel}</p>
            <h2 className="font-display text-3xl text-ink mb-4">{t.problemTitle}</h2>
            <p className="text-gray-600 max-w-2xl mb-12">{t.problemDesc}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">{t.beforeLabel}</p>
                <p className="font-display text-4xl text-red-600 mb-3">38%</p>
                <p className="text-sm text-red-700">{t.beforeDesc}</p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{t.afterLabel}</p>
                <p className="font-display text-4xl text-green-700 mb-3">91%</p>
                <p className="text-sm text-green-700">{t.afterDesc}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.howLabel}</p>
          <h2 className="font-display text-3xl text-ink mb-12">{t.howTitle}</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Upload, title: t.step1Title, desc: t.step1Desc },
            { icon: FileText, title: t.step2Title, desc: t.step2Desc },
            { icon: Download, title: t.step3Title, desc: t.step3Desc },
          ].map((step, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(20,36,61,0.25)] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-mist flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-brand" />
                </div>
                <p className="font-semibold text-ink mb-1">{step.title}</p>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">{t.featuresLabel}</p>
            <h2 className="font-display text-3xl text-ink mb-12">{t.featuresTitle}</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: t.feature1Title, desc: t.feature1Desc },
              { icon: Mail, title: t.feature2Title, desc: t.feature2Desc },
              { icon: FileText, title: t.feature3Title, desc: t.feature3Desc },
              { icon: MessageSquareText, title: t.feature4Title, desc: t.feature4Desc },
              { icon: ShieldCheck, title: t.feature5Title, desc: t.feature5Desc },
              { icon: Users, title: t.feature6Title, desc: t.feature6Desc },
            ].map((f, i) => (
              <FadeIn key={i} delay={(i % 3) * 100}>
                <div className="p-6 rounded-2xl hover:bg-mist transition-colors duration-300">
                  <f.icon className="w-6 h-6 text-brand mb-3" />
                  <p className="font-semibold text-ink mb-1">{f.title}</p>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">{t.finalTitle}</h2>
          <p className="text-gray-600 mb-8">{t.finalSub}</p>
          <Link href="/app" className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_10px_25px_-8px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
            {t.finalCta} →
          </Link>
        </FadeIn>
      </section>

      <MarketingFooter />
    </div>
  )
}