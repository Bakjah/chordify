import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchField from '../search/SearchField.jsx'
import { ROUTES } from '../../constants/routes.js'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import NotificationBell from './NotificationBell.jsx'

const DETAIL_TRAIL = 'DISCOVER  /  SONG LIBRARY  /  CHORD STUDIO'
const PUBLIC_TRAIL = 'DISCOVER  /  CHORDIFY'
const SPACE_TRAIL = 'YOUR SPACE  /  CHORDIFY'

// Halaman "diri sendiri" milik user: sidebar personal, top bar dengan trail YOUR SPACE.
const SPACE_PATHS = [
  ROUTES.LIBRARY,
  ROUTES.FAVORITES,
  ROUTES.PLAYLISTS,
  ROUTES.SETLISTS,
  ROUTES.CONTRIBUTIONS,
  ROUTES.ADD_SONG,
  ROUTES.NOTIFICATIONS,
  ROUTES.VERIFICATION,
]

const MENU_ITEM =
  'flex w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[9px] text-left text-[12px] font-semibold leading-[18px] text-app-text hover:bg-app-elevated'

export default function TopBar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const { unread } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const menuRef = useRef(null)
  const initial = user?.username?.charAt(0).toUpperCase() || 'G'

  const inSpace = SPACE_PATHS.includes(pathname) || /^\/songs\/[^/]+\/edit$/.test(pathname)
  const isDetail = pathname.startsWith('/songs/') && !pathname.startsWith('/songs/new')

  const trail = inSpace ? SPACE_TRAIL : isDetail ? DETAIL_TRAIL : PUBLIC_TRAIL
  const placeholder = 'Search songs or artists'

  // Menu akun menutup sendiri saat pindah halaman atau klik di luar.
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

  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  // Kolom search di top bar mengikuti kata kunci yang sedang dipakai di Song
  // Library, jadi keduanya tidak pernah menampilkan keadaan berbeda.
  useEffect(() => {
    setKeyword(new URLSearchParams(search).get('q') || '')
  }, [search])

  const submitSearch = () => {
    const q = keyword.trim()
    navigate(q ? `${ROUTES.SONGS}?q=${encodeURIComponent(q)}` : ROUTES.SONGS)
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="relative h-[76px] shrink-0">
      <p className="absolute left-[34px] top-[28px] font-mono text-[10px] leading-[20px] text-app-muted">
        {trail}
      </p>

      <SearchField
        value={keyword}
        onChange={setKeyword}
        onSubmit={submitSearch}
        placeholder={placeholder}
        className="absolute right-[240px] top-[18px] h-[42px] w-[350px] rounded-full bg-app-card px-[20px]"
        inputClassName="text-[13px]"
      />

      {isAuthenticated && (
        <span className="absolute right-[200px] top-[18px]">
          <NotificationBell />
        </span>
      )}

      {isAuthenticated ? (
        <div ref={menuRef} className="absolute right-[152px] top-[18px]">
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
                <p className="text-[13px] font-semibold leading-[18px] text-app-text">{user.username}</p>
                <p className="text-[11px] leading-[16px] text-app-muted">{user.email}</p>
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
                onClick={() => go(ROUTES.VERIFICATION)}
                className={MENU_ITEM}
              >
                Verification Request
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => go(ROUTES.PROFILE(user.username))}
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
      ) : (
        <Link
          to={ROUTES.LOGIN}
          className="absolute right-[152px] top-[18px] flex size-[38px] items-center justify-center rounded-full bg-app-elevated"
        >
          <span className="text-[15px] font-bold text-app-accent">{initial}</span>
        </Link>
      )}
    </header>
  )
}
