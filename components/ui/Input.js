export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink
        placeholder:text-gray-400 shadow-[inset_0_1px_2px_rgba(20,36,61,0.04)]
        transition-colors duration-150
        focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15
        disabled:bg-mist disabled:text-gray-400 ${className}`}
      {...props}
    />
  )
}