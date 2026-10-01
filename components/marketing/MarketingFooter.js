'use client'
import Link from 'next/link'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { CONTENT } from './marketingContent'

// Public BC Registries record for Resemy Solutions — linked from the
// footer disclaimer so anyone can verify the registration themselves.
const ORGBOOK_URL = 'https://orgbook.gov.bc.ca/entity/FM1119584/type/registration.registries.ca'

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
          <p className="text-sm text-gray-400 mb-3">{t.tagline}</p>
          <p className="text-sm text-gray-400">
            Email: <a href="mailto:info@getresemy.com" className="hover:text-white">info@getresemy.com</a>
          </p>
          <p className="text-xs text-gray-500 mt-3">Resemy Solutions (Resemy) is a registered business in British Columbia, Canada.</p>
          <a href={ORGBOOK_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-white mt-1 transition-colors">
            Verify business registration
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">{t.product}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/welcome/services" className="hover:text-white">{t.services}</Link></li>
            <li><Link href="/account/plans" className="hover:text-white">{t.pricing}</Link></li>
            <li><Link href="/app" className="hover:text-white">{t.tryFree}</Link></li>
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
            <SocialIcon href="https://www.linkedin.com/company/resemy-solutions/?viewAsMember=true" label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://www.facebook.com/profile.php?id=61594488354438" label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/getresemy" label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.tiktok.com/@getresemy" label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v10.5a3 3 0 1 1-2-2.83V9a5 5 0 1 0 5 5V8.2a6.5 6.5 0 0 0 3 .8V6.5A4.5 4.5 0 0 1 16 3h-2z"/></svg>
            </SocialIcon>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Resemy Solutions. {t.rights}</p>
        <p className="mt-1">Resemy™ is a product of Resemy Solutions.</p>
      </div>
    </footer>
  )
}