'use client'
import { useState } from 'react'

export default function DownloadButton({ generationId }) {
  const [downloading, setDownloading] = useState(false)

  function handleDownload() {
    setDownloading(true)
    window.location.href = `/api/download/${generationId}`
    setTimeout(() => setDownloading(false), 2000)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-50"
    >
      {downloading ? 'Preparing…' : 'Download the generated résumé'}
    </button>
  )
}