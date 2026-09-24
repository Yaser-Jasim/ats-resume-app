'use client'
import { useState, useEffect } from 'react'

export default function ReferenceLetterButton({ generationId, initialLetter, locked }) {
  const [ready, setReady] = useState(!!initialLetter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
  setReady(!!initialLetter)
}, [generationId, initialLetter])

  async function generate() {
    setLoading(true)
    setError('')
    try {
            const res = await fetch('/api/generate-reference-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      })
      let data
      try {
        data = await res.json()
      } catch {
        throw new Error('Connection error — please try again.')
      }
      if (!res.ok) throw new Error(data.error || 'Failed to generate letter.')
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
        🔒 Reference letters are a Pro feature — upgrade to unlock
      </a>
    )
  }

  if (!ready) {
    return (
      <div>
        <button onClick={generate} disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(234,88,12,0.5)] hover:from-orange-500 hover:to-orange-700 active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(234,88,12,0.5)] transition-all disabled:opacity-50">
          {loading ? 'Drafting…' : 'Draft a reference letter (optional)'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <a href={`/api/download-reference-letter/${generationId}`}
         className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(234,88,12,0.5)] hover:from-orange-500 hover:to-orange-700 active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(234,88,12,0.5)] transition-all">
        Download reference letter draft (.docx)
      </a>
      <p className="text-xs text-gray-500 max-w-md">
        This is a starting draft for one of your real references to personalize and sign — not a
        finished letter. Send it to them along with the blanks (their name, title, and one personal
        example) filled in or left for them to complete.
      </p>
    </div>
  )
}