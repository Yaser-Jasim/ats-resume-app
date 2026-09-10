'use client'
import { useState } from 'react'

export default function ApplicationEmailButton({ generationId, initialEmail }) {
  const [email, setEmail] = useState(initialEmail || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-application-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate email.')
      setEmail(data.email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    const text = `Subject: ${email.subject}\n\n${email.body}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!email) {
    return (
      <div>
        <button onClick={generate} disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-50">
          {loading ? 'Writing…' : 'Generate application email (optional)'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="border rounded p-4 space-y-2 max-w-xl">
      <p className="text-sm font-medium">Subject: {email.subject}</p>
      <textarea readOnly className="border rounded p-3 w-full h-40 text-sm" value={email.body} />
      <button onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
        {copied ? 'Copied!' : 'Copy email'}
      </button>
    </div>
  )
}