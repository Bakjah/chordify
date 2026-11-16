import api from './api.js'

export const authService = {
  // body: { identifier, password } -> { token, user }
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  // body: { username, email, password } -> { token, user }
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  // Token sesi dicabut di server supaya tidak bisa dipakai lagi.
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}
