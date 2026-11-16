import api from './api.js'

// Lapisan data genre, dipakai untuk filter di halaman library.
export const genreService = {
  list: () => api.get('/genres').then((r) => r.data),
  search: (q) => api.get('/genres/search', { params: { q } }).then((r) => r.data),
  detail: (id) => api.get(`/genres/${id}`).then((r) => r.data),
}
