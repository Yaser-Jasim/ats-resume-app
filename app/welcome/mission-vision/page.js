'use client'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'

export default function MissionVisionPage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].missionVision

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />
      <section className="max-w-3xl mx-auto px-6 py-20">
        <FadeIn>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 mb-10">{t.subtitle}</p>

          <div className="mb-10">
            <h2 className="font-display text-xl font-semibold text-ink mb-3">{t.missionTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-justify">{t.missionText}</p>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-xl font-semibold text-ink mb-3">{t.visionTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-justify">{t.visionText}</p>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-xl font-semibold text-ink mb-3">{t.objectiveTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-justify">{t.objectiveText}</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">{t.valuesTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.values.map(v => (
                <div key={v.title} className="border border-gray-100 rounded-xl p-4">
                  <p className="font-medium text-ink mb-1">{v.title}</p>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  )
}