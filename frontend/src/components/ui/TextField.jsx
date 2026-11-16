import { forwardRef, useId } from 'react'

/** Input gelap sesuai desain auth (bg #242424, radius 8px, tinggi 48px). */
const TextField = forwardRef(function TextField({ label, error, className = '', ...rest }, ref) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-[6px] block text-xs font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-lg bg-auth-input px-[18px] text-xs text-white placeholder-auth-muted outline-none ring-1 ring-transparent transition focus:ring-auth-green ${
          error ? 'ring-red-500' : ''
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
})

export default TextField
