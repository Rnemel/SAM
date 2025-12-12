import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    proxy: process.env.FLOWISE_BASE_URL && process.env.FLOWISE_FLOW_ID ? {
      '/api/flowise': {
        target: process.env.FLOWISE_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/api\/flowise/, `/api/v1/prediction/${process.env.FLOWISE_FLOW_ID}`),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (process.env.FLOWISE_API_KEY) proxyReq.setHeader('Authorization', `Bearer ${process.env.FLOWISE_API_KEY}`)
          })
        }
      }
    } : undefined,
  },
})
