import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import { useAuth } from '../hooks/useAuth.js'

// Halaman khusus tamu (login/register). User yang sudah login diarahkan keluar.
export default function GuestRoute() {
  const { user, isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={user.role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.HOME} replace />
  }
  return <Outlet />
}
