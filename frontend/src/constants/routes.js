// Satu sumber kebenaran untuk semua path halaman.
export const ROUTES = {
  WELCOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  HOME: '/home',
  SONGS: '/songs',
  SONG_DETAIL: (id = ':id') => `/songs/${id}`,
  CHORD_DICTIONARY: '/chords',

  LIBRARY: '/library',
  FAVORITES: '/favorites',
  PLAYLISTS: '/playlists',
  SETLISTS: '/setlists',
  CONTRIBUTIONS: '/contributions',
  ADD_SONG: '/songs/new',
  EDIT_SONG: (id = ':id') => `/songs/${id}/edit`,
  PROFILE: (username = ':username') => `/profile/${username}`,
  VERIFICATION: '/verification',
  NOTIFICATIONS: '/notifications',

  ADMIN: '/admin',
  ADMIN_SONGS: '/admin/songs',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_VERIFICATION: '/admin/verification',
}
