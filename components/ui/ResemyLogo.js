export default function ResemyLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="resemyLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C4A7C"/>
          <stop offset="100%" stopColor="#14243D"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#resemyLogoGrad)"/>
      <path d="M 25 54 L 41 68 L 78 24" fill="none" stroke="#FFFFFF" strokeWidth="9"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}