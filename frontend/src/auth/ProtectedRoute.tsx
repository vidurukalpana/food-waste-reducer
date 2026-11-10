import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'

export function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
