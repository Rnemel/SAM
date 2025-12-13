import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

const sttPlugin = {
  name: 'stt-middleware',
  configureServer(server) {
    server.middlewares.use('/api/stt', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return }
      try {
        const chunks = []
        req.on('data', c => chunks.push(c))
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            const body = JSON.parse(raw || '{}')
            const audioB64 = body && body.audio
            const mime = body && body.mime || 'audio/webm'
            if (!audioB64) { res.statusCode = 400; res.end(JSON.stringify({ error: 'no-audio' })); return }
            if (!process.env.OPENAI_API_KEY) { res.statusCode = 500; res.end(JSON.stringify({ error: 'missing-openai-key' })); return }
            const buf = Buffer.from(audioB64, 'base64')
            const blob = new Blob([buf], { type: mime })
            const form = new FormData()
            form.append('file', blob, 'audio.webm')
            form.append('model', 'whisper-1')
            const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
              body: form
            })
            const j = await r.json().catch(() => ({}))
            if (r.ok) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ text: j.text || '' }))
            } else {
              res.statusCode = r.status
              res.end(JSON.stringify({ error: j?.error?.message || 'stt-failed' }))
            }
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(err && err.message ? err.message : 'stt-error') }))
          }
        })
      } catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: String(e && e.message ? e.message : 'stt-error') }))
      }
    })
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react(), sttPlugin],
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
