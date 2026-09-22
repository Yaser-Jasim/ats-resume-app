import { APP_VERSION, LAST_UPDATED } from '@/lib/version'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function VersionBadge() {
  return (
    <div className="w-full text-center text-xs text-gray-400 py-3 border-t border-gray-100">
      V {APP_VERSION} · Updated {formatDate(LAST_UPDATED)}
    </div>
  )
}