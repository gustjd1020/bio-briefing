import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Anthropic API 프록시 (CORS 우회용 — dev server only)
      // /api/anthropic → https://api.anthropic.com/v1/messages
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
      },
    },
  },
})
