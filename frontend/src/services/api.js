import axios from 'axios'
import { storage } from '../utils/storage.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Sesi kadaluarsa: hapus token lalu arahkan ke login (kecuali request /auth/* itu sendiri).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthCall && storage.getToken()) {
      storage.clear()
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Coba lagi.') =>
  error?.response?.data?.message || (error?.request ? 'Tidak dapat terhubung ke server.' : fallback)

export default api
