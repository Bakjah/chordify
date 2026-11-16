import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getErrorMessage } from '../../services/api.js'

// Figma: Desktop / 12 Login (node 1:938)
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ identifier: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.identifier.trim()) next.identifier = 'Email atau username wajib diisi.'
    if (!form.password) next.password = 'Password wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const user = await login({
        identifier: form.identifier.trim(),
        password: form.password,
        remember: form.remember,
      })
      const fallback = user.role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.HOME
      navigate(location.state?.from?.pathname || fallback, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Login gagal. Periksa email/username dan password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <p className="font-mono text-[11px] font-bold tracking-wide text-auth-green">WELCOME BACK</p>
      <h1 className="mt-[10px] text-[32px] font-bold leading-[1.45]">Log in to Chordify</h1>
      <p className="mt-[6px] text-[13px] text-auth-muted">Pick up where your music journey left off.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-[44px]">
        <TextField
          label="Email or username"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="you@example.com"
          value={form.identifier}
          onChange={update('identifier')}
          error={errors.identifier}
        />

        <TextField
          className="mt-[22px]"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />

        <div className="mt-[17px] flex items-center justify-between">
          <Checkbox label="Remember me" checked={form.remember} onChange={update('remember')} />
          <Link to="/forgot-password" className="text-xs font-medium text-auth-green hover:underline">
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="auth" size="form" className="mt-[34px]" disabled={loading}>
          {loading ? 'Logging in…' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-auth-muted">
        New to Chordify?&nbsp;&nbsp;
        <Link to={ROUTES.REGISTER} className="transition-colors hover:text-white">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
