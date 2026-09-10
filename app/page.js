import { LanguageProvider } from '@/components/marketing/LanguageContext'
import WelcomeContent from './welcome/page'

export default function HomePage() {
  return (
    <LanguageProvider>
      <WelcomeContent />
    </LanguageProvider>
  )
}