import api from './api.js'

// Konsol admin: statistik, daftar user, dan daftar lagu.
export const adminService = {
  // Angka ringkas untuk dashboard.
  stats: () => api.get('/admin/stats').then((r) => r.data),
  // Daftar akun untuk tabel "Manage Users".
  listUsers: () => api.get('/admin/users').then((r) => r.data),
  // Aktifkan/nonaktifkan sebuah akun.
  setUserActive: (id, active) =>
    api.put(`/admin/users/${id}/active`, { active }).then((r) => r.data),
  // Daftar lagu untuk tabel "Manage Songs".
  listSongs: () => api.get('/admin/songs').then((r) => r.data),
  // Ubah status lagu: PUBLISHED, PENDING, atau REJECTED.
  setSongStatus: (id, status) =>
    api.put(`/admin/songs/${id}/status`, { status }).then((r) => r.data),

  // ------------------------------------------------------------ katalog
  // Daftar artis untuk tabel "Manage Artists".
  listArtists: () => api.get('/admin/artists').then((r) => r.data),
  // Tambah artis baru.
  createArtist: (artist) => api.post('/admin/artists', artist).then((r) => r.data),
  // Ubah data artis.
  updateArtist: (id, artist) => api.put(`/admin/artists/${id}`, artist).then((r) => r.data),
  // Hapus artis yang belum punya lagu.
  deleteArtist: (id) => api.delete(`/admin/artists/${id}`).then(() => undefined),
  // Daftar genre untuk tabel "Manage Genres".
  listGenres: () => api.get('/admin/genres').then((r) => r.data),
  // Tambah genre baru.
  createGenre: (genre) => api.post('/admin/genres', genre).then((r) => r.data),
  // Ubah nama genre.
  updateGenre: (id, genre) => api.put(`/admin/genres/${id}`, genre).then((r) => r.data),
  // Hapus genre yang belum dipakai lagu.
  deleteGenre: (id) => api.delete(`/admin/genres/${id}`).then(() => undefined),
}
