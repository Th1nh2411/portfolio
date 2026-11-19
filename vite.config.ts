import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // stable vendor chunks: cached across deploys, smaller app chunk
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next'],
          icons: ['lucide-react', 'simple-icons'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
