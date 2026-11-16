import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import { useAuth } from '../hooks/useAuth.js'

// Wajib login. Jika `roles` diisi, role user harus termasuk di dalamnya.
export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  return <Outlet />
}
