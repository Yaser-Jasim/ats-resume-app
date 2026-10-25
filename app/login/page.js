'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import ResemyLogo from '@/components/ui/ResemyLogo'

export default function LoginPage() {
    const [mode, setMode] = useState('signup')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [resending, setResending] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const needsAgreement = mode === 'signup'
  const missingName = mode === 'signup' && (!firstName.trim() || !lastName.trim())

  // Signing up still requires agreeing to the Terms. Instead of silently
  // greying the buttons out, explain what is missing and highlight the box.
  function requireAgreement() {
    if (needsAgreement && !agreed) {
      setAgreeError(true)
      setMessage('')
      setError('Please tick the box to agree to the Terms of Service and Privacy Policy to continue.')
      return false
    }
    return true
  }

  async function signInWithGoogle() {
    setError('')
    setMessage('')
    if (!requireAgreement()) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/app`,
        // Always show Google's account picker. Without this, Google silently
        // reuses whichever account the browser is already signed in with.
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  async function resendConfirmation() {
    setError('')
    setResending(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: sentTo || email,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    })
    setResending(false)
    if (error) setError(error.message)
    else setMessage('We sent it again. Check your inbox and your spam or junk folder.')
  }

  async function handleEmailSubmit() {
    setError('')
    setMessage('')
    if (!requireAgreement()) return
    if (missingName) { setError('Please enter your first and last name.'); return }
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: { first_name: firstName.trim(), last_name: lastName.trim() },
        },
      })
      setLoading(false)
      if (error) {
        setError(error.message)
      } else if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists. Try logging in instead.')
      } else {
        setSentTo(email)
        setMessage('Check your email to confirm your account — if you don\'t see it in a minute, check your spam or junk folder.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) setError(error.message)
      else router.push('/app')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 px-4 space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ResemyLogo size={40} />
        <span className="font-display text-2xl font-medium text-ink">Resemy</span>
      </div>

      <div className="flex rounded-xl border border-gray-200 p-1 bg-mist">
        <button
          onClick={() => { setMode('signup'); setError(''); setMessage(''); setAgreeError(false); setSentTo('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white shadow text-ink' : 'text-gray-500'}`}
        >
          Sign Up
        </button>
        <button
          onClick={() => { setMode('login'); setError(''); setMessage(''); setAgreeError(false); setSentTo('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'login' ? 'bg-white shadow text-ink' : 'text-gray-500'}`}
        >
          Log In
        </button>
      </div>

      {needsAgreement && (
        <label className={`flex items-start gap-2 text-xs ${agreeError && !agreed ? 'text-red-600' : 'text-gray-600'}`}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => {
              setAgreed(e.target.checked)
              if (e.target.checked && agreeError) { setAgreeError(false); setError('') }
            }}
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
      {sentTo && mode === 'signup' && (
        <button
          onClick={resendConfirmation}
          disabled={resending}
          className="text-sm underline text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {resending ? 'Sending…' : 'Didn\'t get it? Resend confirmation email'}
        </button>
      )}

      <button onClick={signInWithGoogle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(234,88,12,0.5)] hover:from-orange-500 hover:to-orange-700 active:translate-y-px transition-all">
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex-1 border-t border-gray-200" />
        <span>or use email</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {mode === 'signup' && (
        <div className="flex gap-3">
          <input className="border p-2 w-full rounded" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      )}
      <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <button onClick={handleEmailSubmit} disabled={loading}
              className="border rounded p-2 w-full text-sm font-medium text-ink hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? 'Please wait…' : mode === 'signup' ? 'Create account with email' : 'Log in'}
      </button>
    </div>
  )
}