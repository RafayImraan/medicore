import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: false,
    },
    hmr: {
      timeout: 60000, // Increase HMR timeout to 60 seconds
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'socket.io-client',
      'framer-motion',
      'react-hot-toast',
      'recharts',
      'date-fns',
      'lucide-react',
      'file-saver'
    ],
    exclude: [
      // Exclude heavy or problematic dependencies from pre-bundling
      '@faker-js/faker',
      '@tsparticles/engine',
      '@tsparticles/react',
      'jspdf',
      'html2canvas'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          charts: ['recharts', 'chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
})
