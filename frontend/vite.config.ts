import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendUrl = 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin calls in development, so the browser needs no CORS setup.
    proxy: {
      '/api': backendUrl,
      '/actuator': backendUrl,
    },
  },
})
