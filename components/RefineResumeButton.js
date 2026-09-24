'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'

export default function RefineResumeButton({ generationId, missingKeywords }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  if (!missingKeywords || missingKeywords.length === 0) return null

  async function submit() {
    if (!notes.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/refine-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId, additionalCandidateNotes: notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setOpen(false)
      setNotes('')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-3 border-t border-gray-100 space-y-2">
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-xs text-brand hover:underline">
          Have real experience with any of the missing items above? Add it →
        </button>
      ) : (
                <div className="space-y-2">
          <p className="text-xs text-gray-600">
            For each one you have real experience with, write a sentence saying what you did and roughly where — a list of terms alone won't be enough for us to add it convincingly. Only include things that are actually true.
          </p>
          <p className="text-xs text-gray-500">
            Gaps to consider: {missingKeywords.join(', ')}
          </p>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. I also processed student refunds and managed payment deferment plans while working at [company/role]..."
            rows={4}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 items-center">
            <Button onClick={submit} disabled={loading || !notes.trim()}>
              {loading ? 'Updating…' : 'Update my resume'}
            </Button>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-ink">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}