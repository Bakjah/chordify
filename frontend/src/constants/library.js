// Konstanta yang dipakai bersama oleh halaman member dan konsol admin.

import { ROUTES } from './routes.js'

export const LIBRARY_TABS = ['Favorites', 'Playlists', 'Setlists', 'Recently Viewed']

export const VERIFICATION_CATEGORIES = [
  'Verified Artist',
  'Verified Songwriter',
  'Verified Band Member',
  'Verified Musician',
]

// Menu sidebar member. `badge: true` menandai item yang menampilkan titik
// merah kalau masih ada notifikasi yang belum dibaca.
export const MEMBER_NAV = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Song Library', to: ROUTES.SONGS },
  { label: 'Chord Dictionary', to: ROUTES.CHORD_DICTIONARY },
  { label: 'My Library', to: ROUTES.LIBRARY },
  { label: 'My Favorites', to: ROUTES.FAVORITES },
  { label: 'My Playlists', to: ROUTES.PLAYLISTS },
  { label: 'My Setlists', to: ROUTES.SETLISTS },
  { label: 'My Contributions', to: ROUTES.CONTRIBUTIONS },
  { label: 'Add Song', to: ROUTES.ADD_SONG },
  { label: 'Verification Request', to: ROUTES.VERIFICATION },
  { label: 'Notifications', to: ROUTES.NOTIFICATIONS, badge: true },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', to: ROUTES.ADMIN },
  { label: 'Manage Songs', to: ROUTES.ADMIN_SONGS },
  { label: 'Manage Artists', to: ROUTES.ADMIN_ARTISTS },
  { label: 'Manage Genres', to: ROUTES.ADMIN_GENRES },
  { label: 'Manage Users', to: ROUTES.ADMIN_USERS },
  { label: 'Manage Reports', to: ROUTES.ADMIN_REPORTS },
  { label: 'Manage Verification', to: ROUTES.ADMIN_VERIFICATION },
]
