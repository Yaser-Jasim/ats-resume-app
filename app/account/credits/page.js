'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'

export default function CreditsPage() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profile, setProfile] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setLoggedIn(true)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex"><Sidebar /><main className="p-8"><BackButton /><p className="text-sm text-gray-500">Loading…</p></main></div>

  if (!loggedIn) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="p-8">
          <BackButton />
          <p className="text-sm">Please <a href="/login" className="text-brand underline">log in</a> to view your credit usage.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-md space-y-4">
        <BackButton />
        <h1 className="font-display text-2xl text-ink">Credit Usage</h1>
        <p className="text-sm text-gray-600">Plan: <span className="capitalize font-medium text-ink">{profile.plan}</span></p>
        {profile.plan === 'free' ? (
          <p className="text-sm">Free generations remaining: <span className="font-medium">{profile.credits_remaining}</span></p>
        ) : (
          <p className="text-sm">Unlimited generations on your current plan.</p>
        )}
        {profile.plan === 'free' && profile.credits_remaining <= 0 && (
          <Button onClick={() => window.location.href = '/account/plans'}>Upgrade for more</Button>
        )}
      </main>
    </div>
  )
}