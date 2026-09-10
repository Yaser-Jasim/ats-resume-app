import { LanguageProvider } from '@/components/marketing/LanguageContext'

export default function WelcomeLayout({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>
}