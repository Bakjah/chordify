import { useId } from 'react'

export default function Checkbox({ label, className = '', ...rest }) {
  const id = useId()
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-center gap-2 text-xs text-auth-muted ${className}`}>
      <input id={id} type="checkbox" className="h-3.5 w-3.5 cursor-pointer accent-auth-green" {...rest} />
      {label}
    </label>
  )
}
