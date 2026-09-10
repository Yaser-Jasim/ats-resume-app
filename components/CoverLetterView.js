'use client'
import { useState, useEffect } from 'react'
import Textarea from '@/components/ui/Textarea'

export default function CoverLetterView({ generationId, initialCoverLetter }) {
  const [coverLetter, setCoverLetter] = useState(initialCoverLetter || '')
  const [loading, setLoading] = useState(!initialCoverLetter)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialCoverLetter) return
    generate()
  }, [])

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter.')
      setCoverLetter(data.coverLetter)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Writing your cover letter…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-3">
      <a href={`/api/download-cover-letter/${generationId}`}
         className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark transition-all">
        Download the cover letter
      </a>
      <p className="text-sm font-medium text-ink">or paste</p>
      <Textarea className="h-64" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
    </div>
  )
}