import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { notificationService } from '../services/notificationService.js'

const NotificationContext = createContext(null)

/**
 * Menyimpan jumlah notifikasi yang belum dibaca.
 *
 * <p>Disimpan di satu tempat supaya TopBar, Sidebar, dan konsol admin
 * memakai angka yang sama dan hanya memanggil
 * {@code GET /api/notifications/unread-count} satu kali per muat halaman.
 */
export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const [unread, setUnread] = useState(0)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setUnread(0)
      return
    }
    try {
      setUnread(await notificationService.unreadCount())
    } catch {
      // Badge notifikasi cuma pelengkap; kegagalan ambil angka tidak boleh
      // membuat halaman gagal dibuka.
    }
  }, [isAuthenticated])

  // Angka disegarkan setiap pindah halaman supaya lonceng dan sidebar tidak
  // menampilkan data lama.
  useEffect(() => {
    refresh()
  }, [refresh, pathname])

  const value = useMemo(() => ({ unread, refresh }), [unread, refresh])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications harus dipakai di dalam <NotificationProvider>')
  return ctx
}
