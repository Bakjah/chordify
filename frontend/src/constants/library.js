// Konstanta yang dipakai bersama oleh halaman member dan konsol admin.

import { ROUTES } from './routes.js'

export const LIBRARY_TABS = ['Favorites', 'Playlists', 'Setlists', 'Recently Viewed']

export const VERIFICATION_CATEGORIES = [
  'Verified Artist',
  'Verified Songwriter',
  'Verified Band Member',
  'Verified Musician',
]

// Menu sidebar member. Tiga menu publik ditandai bulat "●"; menu member memakai
// spasi sebagai indentasi. `badge: true` menandai item yang menampilkan titik
// merah kalau masih ada notifikasi yang belum dibaca.
export const MEMBER_NAV = [
  { label: 'Home', to: ROUTES.HOME, marker: '●', section: 'public' },
  { label: 'Song Library', to: ROUTES.SONGS, marker: '●', section: 'public' },
  { label: 'Chord Dictionary', to: ROUTES.CHORD_DICTIONARY, marker: '●', section: 'public' },
  { label: 'My Library', to: ROUTES.LIBRARY, marker: '', section: 'member' },
  { label: 'My Favorites', to: ROUTES.FAVORITES, marker: '', section: 'member' },
  { label: 'My Playlists', to: ROUTES.PLAYLISTS, marker: '', section: 'member' },
  { label: 'My Setlists', to: ROUTES.SETLISTS, marker: '', section: 'member' },
  { label: 'My Contributions', to: ROUTES.CONTRIBUTIONS, marker: '', section: 'member' },
  { label: 'Add Song', to: ROUTES.ADD_SONG, marker: '', section: 'member' },
  { label: 'Verification Request', to: ROUTES.VERIFICATION, marker: '', section: 'member' },
  { label: 'Notifications', to: ROUTES.NOTIFICATIONS, marker: '', section: 'member', badge: true },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', to: ROUTES.ADMIN, marker: '●' },
  { label: 'Manage Songs', to: ROUTES.ADMIN_SONGS, marker: '' },
  { label: 'Manage Artists', to: ROUTES.ADMIN_ARTISTS, marker: '' },
  { label: 'Manage Genres', to: ROUTES.ADMIN_GENRES, marker: '' },
  { label: 'Manage Users', to: ROUTES.ADMIN_USERS, marker: '' },
  { label: 'Manage Reports', to: ROUTES.ADMIN_REPORTS, marker: '' },
  { label: 'Manage Verification', to: ROUTES.ADMIN_VERIFICATION, marker: '' },
]
