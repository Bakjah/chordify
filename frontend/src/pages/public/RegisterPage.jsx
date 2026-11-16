import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getErrorMessage } from '../../services/api.js'

// Figma: Desktop / 13 Register (node 1:957)
export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'Username wajib diisi.'
    if (!form.email.trim()) next.email = 'Email wajib diisi.'
    if (!form.password) next.password = 'Password wajib diisi.'
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Konfirmasi password tidak sama.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate(ROUTES.HOME, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Pendaftaran gagal. Silakan coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <p className="font-mono text-[11px] font-bold tracking-wide text-auth-green">
        JOIN THE COMMUNITY
      </p>
      <h1 className="mt-[10px] text-[32px] font-bold leading-[1.45]">Create your account</h1>
      <p className="mt-[6px] text-[13px] text-auth-muted">
        Build your personal guitar chord library.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-[44px]">
        <TextField
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={update('username')}
          error={errors.username}
        />

        <TextField
          className="mt-[22px]"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
        />

        <TextField
          className="mt-[22px]"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />

        <TextField
          className="mt-[22px]"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
        />

        {serverError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="auth" size="form" className="mt-[38px]" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-auth-muted">
        Already have an account?&nbsp;&nbsp;
        <Link to={ROUTES.LOGIN} className="transition-colors hover:text-white">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
