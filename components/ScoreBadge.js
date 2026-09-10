export default function ScoreBadge({ label, value, color }) {
  const size = 104
  const stroke = 9
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(value, 0), 100)
  const offset = circumference * (1 - pct / 100)

  const COLORS = {
    green: { ring: '#2E7D32', text: 'text-green-700' },
    blue: { ring: '#1F3864', text: 'text-ink' },
  }
  const c = COLORS[color] || COLORS.blue

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#EEF1F5" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={c.ring} strokeWidth={stroke} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-semibold ${c.text}`}>{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}