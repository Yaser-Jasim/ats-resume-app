'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'

export default function FeedbackPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function send() {
    setError('')
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      return
    }
    setSent(true)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-md space-y-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Send Feedback</h1>
        {sent ? (
          <p className="text-sm text-green-700">Thanks — we got it.</p>
        ) : (
          <>
            <textarea className="border rounded p-3 w-full h-32" value={message} onChange={e => setMessage(e.target.value)} placeholder="What's working, what's not..." />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button onClick={send} disabled={!message} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-50">Send</button>
          </>
        )}
      </main>
    </div>
  )
}