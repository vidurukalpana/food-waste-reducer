import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Brand } from './Brand'
import { ChartIcon, DashboardIcon, ListIcon, LogOutIcon, SettingsIcon } from './icons'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/items', label: 'Items', Icon: ListIcon },
  { to: '/summary', label: 'Summary', Icon: ChartIcon },
]

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-forest">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" aria-label="Dashboard">
          <Brand />
        </Link>

        <nav className="hidden gap-1 rounded-full bg-white/10 p-1 sm:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-sun text-forest' : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user && <span className="hidden text-white/70 md:inline">{user.email}</span>}
          <NavLink
            to="/settings"
            aria-label="Settings"
            title="Settings"
            className={({ isActive }) =>
              `grid size-9 place-items-center rounded-full transition ${
                isActive ? 'bg-sun text-forest' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <SettingsIcon className="size-5" />
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <LogOutIcon className="size-4" />
            <span className="sr-only sm:not-sr-only">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// Phone-only tab bar.
function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-3xl bg-white px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(12,59,46,0.08)] sm:hidden">
      <ul className="flex justify-around">
        {navLinks.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-xs font-medium ${
                  isActive ? 'text-forest' : 'text-forest/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid size-9 place-items-center rounded-full ${isActive ? 'bg-sun' : ''}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28 pt-6 sm:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
