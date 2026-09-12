'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { LanguageProvider } from '@/components/marketing/LanguageContext'
import WelcomeContent from './welcome/page'

export default function HomePage() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/app')
      } else {
        setChecking(false)
      }
    })
  }, [])

  if (checking) return null

  return (
    <LanguageProvider>
      <WelcomeContent />
    </LanguageProvider>
  )
}