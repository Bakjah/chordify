import api from './api.js'

// Lapisan data lagu. Semua halaman yang menampilkan lagu memakai ini,
// bukan data statis, supaya isi library sama dengan yang ada di server.
export const songService = {
  // Daftar lagu di library publik. params: { page, size, sort, q }
  list: (params) => api.get('/songs', { params }).then((r) => r.data),
  // Pencarian cepat judul untuk live search.
  search: (q, size = 8) => api.get('/songs/search', { params: { q, size } }).then((r) => r.data),
  // Detail satu lagu.
  detail: (id) => api.get(`/songs/${id}`).then((r) => r.data),
  // Chord digeser naik/turun (semitones positif naik, negatif turun).
  transpose: (id, semitones) =>
    api.get(`/songs/${id}/transpose`, { params: { semitones } }).then((r) => r.data),
  // Menambah lagu baru (kontribusi komunitas).
  create: (payload) => api.post('/songs', payload).then((r) => r.data),
  // Mengubah lagu milik sendiri.
  update: (id, payload) => api.put(`/songs/${id}`, payload).then((r) => r.data),
  // Menghapus lagu milik sendiri.
  remove: (id) => api.delete(`/songs/${id}`).then((r) => r.data),
  // Mengunggah berkas audio playback (mp3, mp4a, dan sejenisnya).
  // Header Content-Type sengaja dikosongkan supaya browser yang menentukan
  // multipart boundary-nya sendiri.
  uploadMedia: (id, file) => {
    const data = new FormData()
    data.append('file', file)
    return api
      .post(`/songs/${id}/media`, data, { headers: { 'Content-Type': undefined } })
      .then((r) => r.data)
  },
  // Menghapus berkas audio playback.
  removeMedia: (id) => api.delete(`/songs/${id}/media`).then(() => undefined),
}

export const artistService = {
  list: () => api.get('/artists').then((r) => r.data),
  search: (q) => api.get('/artists/search', { params: { q } }).then((r) => r.data),
  detail: (id) => api.get(`/artists/${id}`).then((r) => r.data),
}
