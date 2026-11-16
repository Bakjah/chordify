import { NavLink, useLocation } from 'react-router-dom'
import { MEMBER_NAV } from '../../constants/library.js'
import { useNotifications } from '../../context/NotificationContext.jsx'

const PUBLIC_PATHS = MEMBER_NAV.filter((item) => item.section === 'public').map((item) => item.to)

export default function Sidebar() {
  const { pathname } = useLocation()
  const { unread } = useNotifications()
  // Halaman detail lagu (/songs/:id) masih bagian menu publik, tapi
  // /songs/new dan /songs/:id/edit adalah halaman kerja pengguna.
  const inPublicSection =
    PUBLIC_PATHS.some((path) => pathname === path) || /^\/songs\/[^/]+$/.test(pathname)

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col bg-app-sidebar lg:flex">
      <div className="px-[26px] pt-[26px]">
        <p className="text-[25px] font-bold leading-[36px] text-app-text">CHORDIFY</p>
        <p className="mt-[-2px] h-[20px] font-mono text-[9px] leading-[20px] text-app-muted">
          YOUR GUITAR CHORD LIBRARY
        </p>
      </div>

      <div className="mx-[24px] mt-[12px] h-px w-[188px] bg-app-border" />

      <nav className="mt-[25px] flex flex-col">
        {MEMBER_NAV.map((item) => (
          <NavLink key={item.label} to={item.to} className="relative block h-[43px]">
            {({ isActive }) => {
              // Hijau dipakai untuk bagian yang sedang aktif: seluruh menu publik
              // saat pengguna berada di halaman publik, atau menu member yang aktif.
              const highlighted =
                item.section === 'public' ? inPublicSection : isActive
              const base =
                'absolute left-[16px] right-[16px] top-0 flex h-[38px] items-center rounded-[8px] pl-[12px] text-[13px] font-medium leading-[20px]'
              const tone = highlighted ? 'text-app-accent' : 'text-app-muted'
              return (
                <span className={`${base} ${isActive ? 'bg-app-card' : ''} ${tone}`}>
                  <span className="whitespace-pre">{item.marker ? `${item.marker}  ` : '   '}</span>
                  {item.label}
                  {item.badge && unread > 0 && (
                    <span
                      title={`${unread} notifikasi belum dibaca`}
                      className="absolute right-[8px] top-[15px] size-[8px] rounded-full bg-[#ef4444]"
                    />
                  )}
                </span>
              )
            }}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
