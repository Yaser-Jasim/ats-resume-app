'use client'
import { useState, useEffect } from 'react'

// Increments the site-wide page view counter on mount and displays the
// running total. Used in both the marketing footer and the app sidebar, so
// the same number grows from traffic across the whole site. Fails silently
// if the request errors — this is a nice-to-have display, not something
// that should ever break a page.
export default function PageViewCounter({ className = '' }) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/page-views', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && typeof data.total === 'number') setCount(data.total)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (count === null) return null

  return (
    <span className={className}>
      {count.toLocaleString()} page views
    </span>
  )
}