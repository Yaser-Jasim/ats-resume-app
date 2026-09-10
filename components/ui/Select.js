import { ChevronDown } from 'lucide-react'

export default function Select({ className = '', children, ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-ink
          shadow-[inset_0_1px_2px_rgba(20,36,61,0.04)] transition-colors duration-150
          focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}