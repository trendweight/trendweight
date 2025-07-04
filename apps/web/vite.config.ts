import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy all /api requests to the C# backend
      '/api': {
        target: 'http://localhost:5199',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Forward the original host and protocol
            const host = req.headers.host
            if (host) {
              proxyReq.setHeader('X-Forwarded-Host', host)
            }
            proxyReq.setHeader('X-Forwarded-Proto', req.connection.encrypted ? 'https' : 'http')
          })
        }
      }
    }
  }
})
