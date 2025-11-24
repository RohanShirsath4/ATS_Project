import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ats-backend-pvbk.onrender.com',
        // target:'http://localhost:3500',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
