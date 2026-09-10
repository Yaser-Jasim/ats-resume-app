'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import ResemyLogo from '@/components/ui/ResemyLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const supabase = createClient()

    async function signInWithGoogle() {
    if (!agreed) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
  }

  async function signUpWithEmail() {
    if (!agreed) return
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    })
    if (error) alert(error.message)
    else alert('Check your email to confirm your account.')
  }

  return (
    <div className="max-w-sm mx-auto mt-24 space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ResemyLogo size={40} />
        <span className="font-display text-2xl font-medium text-ink">Resemy</span>
      </div>
      <h1 className="text-2xl font-semibold">Log in or sign up</h1>
      <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to the{' '}
          <a href="/terms" target="_blank" className="underline hover:text-gray-800">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" className="underline hover:text-gray-800">Privacy Policy</a>.
        </span>
      </label>

      <button onClick={signUpWithEmail} disabled={!agreed}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        Continue with email
      </button>
      <button onClick={signInWithGoogle} disabled={!agreed}
              className="border rounded p-2 w-full disabled:opacity-40 disabled:cursor-not-allowed">
        Continue with Google
      </button>
    </div>
  )
}