import api from './api.js'

// Lapisan data library pribadi member: favorit, playlist, setlist, dan riwayat.
// Semua endpoint di /api/library hanya bisa dipakai user yang sudah login.
export const libraryService = {
  // --- Favorit ---
  favorites: () => api.get('/library/favorites').then((r) => r.data),
  addFavorite: (songId) => api.post(`/library/favorites/${songId}`).then((r) => r.data),
  removeFavorite: (songId) => api.delete(`/library/favorites/${songId}`).then((r) => r.data),

  // --- Playlist ---
  playlists: () => api.get('/library/playlists').then((r) => r.data),
  createPlaylist: (payload) => api.post('/library/playlists', payload).then((r) => r.data),
  updatePlaylist: (id, payload) => api.put(`/library/playlists/${id}`, payload).then((r) => r.data),
  deletePlaylist: (id) => api.delete(`/library/playlists/${id}`).then((r) => r.data),
  playlistSongs: (id) => api.get(`/library/playlists/${id}/songs`).then((r) => r.data),
  addSongToPlaylist: (id, songId) =>
    api.post(`/library/playlists/${id}/songs/${songId}`).then((r) => r.data),
  removeSongFromPlaylist: (id, songId) =>
    api.delete(`/library/playlists/${id}/songs/${songId}`).then((r) => r.data),

  // --- Setlist ---
  setlists: () => api.get('/library/setlists').then((r) => r.data),
  createSetlist: (payload) => api.post('/library/setlists', payload).then((r) => r.data),
  updateSetlist: (id, payload) => api.put(`/library/setlists/${id}`, payload).then((r) => r.data),
  deleteSetlist: (id) => api.delete(`/library/setlists/${id}`).then((r) => r.data),
  setlistSongs: (id) => api.get(`/library/setlists/${id}/songs`).then((r) => r.data),
  addSongToSetlist: (id, songId) =>
    api.post(`/library/setlists/${id}/songs/${songId}`).then((r) => r.data),
  removeSongFromSetlist: (id, songId) =>
    api.delete(`/library/setlists/${id}/songs/${songId}`).then((r) => r.data),

  // --- Riwayat lagu yang terakhir dilihat ---
  history: (limit = 20) => api.get('/library/history', { params: { limit } }).then((r) => r.data),
  recordView: (songId) => api.post(`/library/history/${songId}`).then((r) => r.data),
}
