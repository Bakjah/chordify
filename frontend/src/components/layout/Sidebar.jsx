import { NavLink, useLocation } from 'react-router-dom'
import { MEMBER_NAV } from '../../constants/library.js'
import { ROUTES } from '../../constants/routes.js'
import { useNotifications } from '../../context/NotificationContext.jsx'

// Halaman detail lagu (/songs/:id) masih bagian Song Library, tapi /songs/new
// dan /songs/:id/edit adalah halaman kerja pengguna.
const isSongDetail = (path) => /^\/songs\/[^/]+$/.test(path) && path !== ROUTES.ADD_SONG

export default function Sidebar() {
  const { pathname } = useLocation()
  const { unread } = useNotifications()

  // Hanya halaman yang sedang dibuka yang hijau dan bertitik.
  const isActive = (item) =>
    item.to === pathname || (item.to === ROUTES.SONGS && isSongDetail(pathname))

  return (
    // Sticky + self-start: sidebar tetap menempel di kiri layar saat halaman
    // digulir, dan ikut tinggi layar penuh supaya warnanya menutup sisi kiri.
    <aside className="hidden h-screen w-[236px] shrink-0 self-start flex-col overflow-y-auto bg-app-sidebar lg:sticky lg:top-0 lg:flex">
      <div className="px-[26px] pt-[26px]">
        <p className="text-[25px] font-bold leading-[36px] text-app-text">CHORDIFY</p>
        <p className="mt-[-2px] h-[20px] font-mono text-[9px] font-bold leading-[20px] text-app-accent">
          YOUR GUITAR CHORD LIBRARY
        </p>
      </div>

      <div className="mx-[24px] mt-[12px] h-px w-[188px] bg-app-border" />

      <nav className="mt-[25px] flex flex-col">
        {MEMBER_NAV.map((item) => {
          const active = isActive(item)
          const base =
            'absolute left-[16px] right-[16px] top-0 flex h-[38px] items-center rounded-[8px] pl-[12px] text-[13px] font-medium leading-[20px]'
          const tone = active ? 'bg-app-card text-app-accent' : 'text-app-muted'
          return (
            <NavLink key={item.label} to={item.to} className="relative block h-[43px]">
              <span className={`${base} ${tone}`}>
                <span className="whitespace-pre">{active ? '●  ' : '   '}</span>
                {item.label}
                {item.badge && unread > 0 && (
                  <span
                    title={`${unread} notifikasi belum dibaca`}
                    className="absolute right-[8px] top-[15px] size-[8px] rounded-full bg-[#ef4444]"
                  />
                )}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
