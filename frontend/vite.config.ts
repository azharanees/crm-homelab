import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
    define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    host:true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://backend:3000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})