import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { useAuth } from './auth/useAuth'
import { ApiStatus } from './components/ApiStatus'
import { DashboardPage } from './pages/DashboardPage'
import { ItemDetailPage } from './pages/ItemDetailPage'
import { ItemsPage } from './pages/ItemsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SummaryPage } from './pages/SummaryPage'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/items', label: 'Items' },
  { to: '/summary', label: 'Summary' },
]

function Header() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 bg-gray-100 px-4 py-3">
      <span className="font-bold">Food Waste Reducer</span>
      {token && (
        <nav className="flex gap-4 text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'font-semibold underline' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="flex items-center gap-3 text-sm">
        <ApiStatus />
        {token && (
          <>
            {user && <span className="text-gray-700">{user.email}</span>}
            <button type="button" onClick={handleLogout} className="underline">
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
