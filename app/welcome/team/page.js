'use client'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import FadeIn from '@/components/marketing/FadeIn'
import { useLanguage } from '@/components/marketing/LanguageContext'
import { CONTENT } from '@/components/marketing/marketingContent'
import { ExternalLink, GraduationCap } from 'lucide-react'

// Non-text data that doesn't need translating (photo, email, links). Order must
// match the order of `team.members` in marketingContent.js for each language.
const TEAM_META = [
  {
    company: 'Resemy',
    email: 'admin@resemysolutions.com',
    photo: '/team/yaser.jpg',
    linkedinHref: 'https://www.linkedin.com/in/yaser-jasim/?isSelfProfile=true',
    scholarHref: 'https://scholar.google.ca/citations?user=5hjp1DoAAAAJ&hl=en',
  },
]

function LinkIcon({ icon }) {
  if (icon === 'scholar') return <GraduationCap className="w-4 h-4" />
  return <ExternalLink className="w-4 h-4" />
}

export default function TeamPage() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].team

  return (
    <div className="bg-paper" dir={dir}>
      <MarketingNav />
      <section className="max-w-4xl mx-auto px-6 py-20">
        <FadeIn>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 mb-10">{t.subtitle}</p>

          <div className="space-y-8">
            {t.members.map((member, idx) => {
              const meta = TEAM_META[idx]
              return (
                <div key={member.name} className="flex flex-col sm:flex-row gap-8 border border-gray-100 rounded-2xl p-8">
                  <div className="sm:w-80 flex-shrink-0">
                    <div className="w-44 h-44 rounded-xl bg-mist flex items-center justify-center overflow-hidden">
                      {meta.photo ? (
                        <img src={meta.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <span className="text-gray-400 text-sm">Photo</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="font-display text-lg font-medium text-ink">{member.name}</p>
                      <p className="text-sm text-gray-600 whitespace-nowrap">{member.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{meta.company}</p>
                      <a href={`mailto:${meta.email}`} className="text-sm text-brand hover:underline mt-1 inline-block whitespace-nowrap">
                        {meta.email}
                      </a>
                      <div className="mt-4 flex items-center gap-3">
                        <img src="/team/resemy-logo.png" alt="Resemy" className="h-8 w-auto" />
                        <img src="/team/resemy-solutions-seal.png" alt="Resemy Solutions" className="h-12 w-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div>
                      <p className="text-sm font-medium text-black uppercase tracking-wide mb-1">{t.bioLabel}</p>
                      <div className="space-y-3">
                        {member.bio.map((paragraph, i) => (
                          <p
                            key={i}
                            className={`text-base text-gray-600 leading-relaxed text-justify ${
                              i === member.bio.length - 1 ? 'font-bold' : ''
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <a
                        href={meta.linkedinHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-ink flex items-center gap-1.5"
                      >
                        <LinkIcon icon="linkedin" />
                        {member.linkedinLabel}
                      </a>
                      <a
                        href={meta.scholarHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-ink flex items-center gap-1.5"
                      >
                        <LinkIcon icon="scholar" />
                        {member.scholarLabel}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  )
}