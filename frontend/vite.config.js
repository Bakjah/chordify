import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Semua request /api diteruskan ke Spring Boot (port 8080) saat development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
