'use client'
import { useState } from 'react'

export default function InterviewPrepView({ generationId, initialPrep, locked }) {
  const [ready, setReady] = useState(!!initialPrep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate interview prep.')
      setReady(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (locked) {
    return (
      <a href="/account/plans" className="inline-block border border-dashed rounded px-4 py-2 text-sm text-gray-500 hover:text-ink hover:border-gray-400">
        🔒 Interview prep is a Pro feature — upgrade to unlock
      </a>
    )
  }

  if (!ready) {
    return (
      <div>
        <button onClick={generate} disabled={loading} className="border rounded px-4 py-2 text-sm disabled:opacity-50">
          {loading ? 'Preparing…' : 'Prep me for the interview (optional)'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <a href={`/api/download-interview-prep/${generationId}`}
       className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark transition-all">
      Download interview prep (.docx)
    </a>
  )
}