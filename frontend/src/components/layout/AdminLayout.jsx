import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ADMIN_NAV } from '../../constants/library.js'
import { ROUTES } from '../../constants/routes.js'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import NotificationBell from './NotificationBell.jsx'

const ADMIN_TRAILS = {
  '/admin': 'ADMINISTRATION  /  OVERVIEW',
}

const MENU_ITEM =
  'flex w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[9px] text-left text-[12px] font-semibold leading-[18px] text-app-text hover:bg-app-elevated'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { unread } = useNotifications()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const trail = ADMIN_TRAILS[pathname] || 'ADMINISTRATION  /  MANAGEMENT'
  const initial = user?.username?.charAt(0).toUpperCase() || 'A'

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="flex min-h-screen bg-app-bg text-app-text">
      <aside className="hidden w-[236px] shrink-0 flex-col bg-app-sidebar lg:flex">
        <div className="px-[26px] pt-[26px]">
          <p className="text-[25px] font-bold leading-[36px] text-app-text">CHORDIFY</p>
          <p className="mt-[-2px] h-[20px] font-mono text-[9px] font-bold leading-[20px] text-app-accent">
            ADMIN CONSOLE
          </p>
        </div>

        <div className="mx-[24px] mt-[12px] h-px w-[188px] bg-app-border" />

        <nav className="mt-[25px] flex flex-col">
          {ADMIN_NAV.map((item) => (
            <NavLink key={item.label} to={item.to} end className="relative block h-[43px]">
              {({ isActive }) => (
                <span
                  className={`absolute left-[16px] right-[16px] top-0 flex h-[38px] items-center rounded-[8px] pl-[12px] text-[13px] font-medium leading-[20px] ${
                    isActive ? 'bg-app-card text-app-accent' : 'text-app-muted'
                  }`}
                >
                  <span className="whitespace-pre">{isActive ? '●  ' : '   '}</span>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-[24px] pb-[26px]">
          <div className="h-px w-[188px] bg-app-border" />
          <p className="mt-[14px] truncate text-[12px] font-semibold leading-[18px] text-app-text">
            @{user?.username}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-[8px] h-[34px] w-[188px] rounded-[8px] bg-app-card text-[12px] font-medium leading-[20px] text-app-muted hover:bg-app-elevated hover:text-app-text"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative h-[76px] shrink-0">
          <p className="absolute left-[34px] top-[28px] font-mono text-[10px] leading-[20px] text-app-muted">
            {trail}
          </p>

          <span className="absolute right-[84px] top-[18px]">
            <NotificationBell />
          </span>

          <div ref={menuRef} className="absolute right-[34px] top-[18px]">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Menu akun"
              className="flex size-[38px] items-center justify-center rounded-full bg-app-elevated"
            >
              <span className="text-[15px] font-bold text-app-accent">{initial}</span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[46px] w-[210px] rounded-[10px] border border-app-border bg-app-card p-[6px]"
              >
                <div className="px-[10px] py-[8px]">
                  <p className="text-[13px] font-semibold leading-[18px] text-app-text">{user?.username}</p>
                  <p className="text-[11px] leading-[16px] text-app-muted">{user?.email}</p>
                </div>
                <div className="h-px w-full bg-app-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => go(ROUTES.NOTIFICATIONS)}
                  className={`mt-[4px] ${MENU_ITEM}`}
                >
                  Notifications
                  {unread > 0 && (
                    <span className="ml-auto rounded-full bg-[#ef4444] px-[6px] text-[10px] leading-[16px] text-white">
                      {unread}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => go(ROUTES.PROFILE(user?.username))}
                  className={MENU_ITEM}
                >
                  My Profile
                </button>
                <div className="my-[4px] h-px w-full bg-app-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className={MENU_ITEM}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
