export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'text-white bg-gradient-to-b from-navy-light to-brand ' +
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] ' +
      'hover:from-brand hover:to-navy-dark ' +
      'active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(20,36,61,0.5)]',
    secondary: 'text-ink bg-white border border-gray-200 ' +
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_-2px_rgba(20,36,61,0.15)] ' +
      'hover:border-gray-300 hover:bg-gray-50 ' +
      'active:translate-y-px active:shadow-[0_1px_2px_-1px_rgba(20,36,61,0.15)]',
    ghost: 'text-ink hover:bg-mist rounded-lg px-3 py-1.5 shadow-none',
    danger: 'text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 shadow-none',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}