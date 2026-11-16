import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Semua request /api diteruskan ke Spring Boot (port 8080) saat development.
// Target bisa diganti lewat VITE_API_PROXY_TARGET kalau backend jalan di port lain.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
