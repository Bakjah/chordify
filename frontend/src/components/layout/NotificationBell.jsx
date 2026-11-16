import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { useNotifications } from '../../context/NotificationContext.jsx'

/**
 * Tombol lonceng notifikasi dengan penanda jumlah belum dibaca.
 *
 * <p>Posisi menentukan oleh pemanggil lewat wrapper, supaya komponen yang
 * sama bisa dipakai di top bar aplikasi dan di konsol admin.
 */
export default function NotificationBell() {
  const { unread } = useNotifications()

  return (
    <Link
      to={ROUTES.NOTIFICATIONS}
      aria-label="Notifikasi"
      title="Notifications"
      className="relative flex size-[38px] items-center justify-center rounded-full bg-app-elevated text-app-muted hover:text-app-text"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      {unread > 0 && (
        <span className="absolute -right-[2px] -top-[2px] flex min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-[5px] text-[10px] font-bold leading-[18px] text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
