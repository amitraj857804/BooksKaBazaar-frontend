import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow accessing from different subdomains during development
    middlewareMode: false,
    hmr: {
      // Use your local machine IP for HMR in case you're accessing from different domains
      host: 'localhost',
      port: 5173,
    },
  },
  preview: {
    // Support subdomain routing in preview mode
    proxy: {
      '/.': {
        target: 'http://localhost:5173/',
        changeOrigin: true,
      },
    },
  },
})

