import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-chord-bg disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  // Tombol hijau: "Try Now →"
  primary: 'bg-chord-green text-chord-bg hover:brightness-110 focus-visible:ring-chord-green',
  // Tombol gelap berborder: "Sign in"
  secondary:
    'border border-chord-border bg-chord-surface font-semibold text-chord-text hover:bg-chord-border/60 focus-visible:ring-chord-border',
  // Tombol form auth: "Log In"
  auth: 'bg-auth-green text-auth-bg hover:brightness-110 focus-visible:ring-auth-green',
}

const sizes = {
  pill: 'h-[58px] rounded-full px-8 text-base',
  form: 'h-12 w-full rounded-[9px] text-sm',
}

/**
 * Jika `to` diberikan, dirender sebagai <Link>, selain itu <button>.
 */
export default function Button({ variant = 'primary', size = 'pill', to, className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
