'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [location, setLocation] = useState('')
  const [plan, setPlan] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setLoggedIn(true)
      setEmail(user.email)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setFullName(profile.full_name || '')
        setLocation(profile.location || '')
        setPlan(profile.plan || 'free')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: fullName, location }).eq('id', user.id)
    setSaving(false)
    alert('Saved.')
  }

  if (loading) return <div className="flex"><Sidebar /><main className="p-8"><BackButton /><p className="text-sm text-gray-500">Loading…</p></main></div>

  if (!loggedIn) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="p-8">
          <BackButton />
          <p className="text-sm">Please <a href="/login" className="text-brand underline">log in</a> to view your account.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className=" mx-auto p-8 max-w-md space-y-4">
        <BackButton />
        <h1 className="font-display text-2xl text-ink">Account Information</h1>
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <Input className="mt-1.5 bg-mist" value={email} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Full name</label>
          <Input className="mt-1.5" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div id="location">
          <label className="text-sm font-medium text-ink">Location (Address)</label>
          <Input className="mt-1.5" placeholder="e.g. Surrey, BC, Canada"
                 value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Current plan</label>
          <p className="text-sm text-gray-600 capitalize">{plan}</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </main>
    </div>
  )
}