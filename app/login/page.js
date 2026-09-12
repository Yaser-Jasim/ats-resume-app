'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import ResemyLogo from '@/components/ui/ResemyLogo'

export default function LoginPage() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const needsAgreement = mode === 'signup'

  async function signInWithGoogle() {
    if (needsAgreement && !agreed) return
      await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/app` },
    })
  }

  async function handleEmailSubmit() {
    setError('')
    setMessage('')
    if (needsAgreement && !agreed) return
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/app` },
      })
      setLoading(false)
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) setError(error.message)
      else router.push('/app')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ResemyLogo size={40} />
        <span className="font-display text-2xl font-medium text-ink">Resemy</span>
      </div>

      <div className="flex rounded-xl border border-gray-200 p-1 bg-mist">
        <button
          onClick={() => { setMode('signup'); setError(''); setMessage('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white shadow text-ink' : 'text-gray-500'}`}
        >
          Sign Up
        </button>
        <button
          onClick={() => { setMode('login'); setError(''); setMessage('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'login' ? 'bg-white shadow text-ink' : 'text-gray-500'}`}
        >
          Log In
        </button>
      </div>

      <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      {needsAgreement && (
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
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {message && <p className="text-green-700 text-sm">{message}</p>}

      <button onClick={handleEmailSubmit} disabled={(needsAgreement && !agreed) || loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
      </button>
      <button onClick={signInWithGoogle} disabled={needsAgreement && !agreed}
              className="border rounded p-2 w-full disabled:opacity-40 disabled:cursor-not-allowed">
        Continue with Google
      </button>
    </div>
  )
}