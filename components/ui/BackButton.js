'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ className = '' }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink transition-colors mb-4 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  )
}