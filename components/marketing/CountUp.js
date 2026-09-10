'use client'
import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, suffix = '', duration = 1200 }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const start = performance.now()
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.round(to * progress))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.unobserve(el)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration, started])

  return <span ref={ref}>{value}{suffix}</span>
}