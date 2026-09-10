'use client'
import { useState } from 'react'

export default function Avatar({ email, photoUrl, name, size = 32 }) {
  const [failed, setFailed] = useState(false)
  const initial = (name?.[0] || email?.[0] || '?').toUpperCase()
  const dimension = `${size}px`

  if (photoUrl && !failed) {
    return (
      <img
        src={photoUrl}
        alt=""
        referrerPolicy="no-referrer"
        style={{ width: dimension, height: dimension }}
        className="rounded-full object-cover flex-shrink-0"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold flex-shrink-0"
    >
      {initial}
    </div>
  )
}