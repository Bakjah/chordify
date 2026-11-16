import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'

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

export default function TopBar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const initial = user?.username?.charAt(0).toUpperCase() || 'G'

  const inSpace = SPACE_PATHS.includes(pathname) || /^\/songs\/[^/]+\/edit$/.test(pathname)
  const isDetail = pathname.startsWith('/songs/') && !pathname.startsWith('/songs/new')

  const trail = inSpace ? SPACE_TRAIL : isDetail ? DETAIL_TRAIL : PUBLIC_TRAIL
  const placeholder = inSpace
    ? 'Search songs or artists'
    : 'Search songs, artists, chords...'

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

      <div className="absolute right-[240px] top-[18px] flex h-[42px] w-[350px] items-center rounded-full bg-app-card px-[20px]">
        <span className="text-[13px] text-app-muted">⌕</span>
        <span className="ml-[10px] text-[13px] text-app-muted">{placeholder}</span>
      </div>

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
                onClick={handleLogout}
                className="mt-[4px] w-full rounded-[8px] px-[10px] py-[9px] text-left text-[12px] font-semibold leading-[18px] text-app-text hover:bg-app-elevated"
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
