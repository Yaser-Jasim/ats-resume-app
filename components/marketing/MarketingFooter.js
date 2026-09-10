'use client'
import Link from 'next/link'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { useLanguage } from './LanguageContext'
import { CONTENT } from './marketingContent'

function SocialIcon({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
      {children}
    </a>
  )
}

export default function MarketingFooter() {
  const { lang, dir } = useLanguage()
  const t = CONTENT[lang].footer

  return (
    <footer dir={dir} className="bg-ink text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ResemyLogo size={28} />
            <span className="font-display text-lg text-white">Resemy</span>
          </div>
          <p className="text-sm text-gray-400">{t.tagline}</p>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">{t.product}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/welcome/services" className="hover:text-white">{t.services}</Link></li>
            <li><Link href="/account/plans" className="hover:text-white">{t.pricing}</Link></li>
            <li><Link href="/" className="hover:text-white">{t.tryFree}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">{t.company}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/welcome/about" className="hover:text-white">{t.about}</Link></li>
            <li><Link href="/welcome/contact" className="hover:text-white">{t.contact}</Link></li>
            <li><Link href="/terms" className="hover:text-white">{t.terms}</Link></li>
            <li><Link href="/privacy" className="hover:text-white">{t.privacy}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">{t.followUs}</p>
          <div className="flex gap-3">
            <SocialIcon href="#" label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/></svg>
            </SocialIcon>
            <SocialIcon href="#" label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v10.5a3 3 0 1 1-2-2.83V9a5 5 0 1 0 5 5V8.2a6.5 6.5 0 0 0 3 .8V6.5A4.5 4.5 0 0 1 16 3h-2z"/></svg>
            </SocialIcon>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Resemy. {t.rights}
      </div>
    </footer>
  )
}