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
    host: true, // Listen on all interfaces to avoid localhost issues on Windows
    port: 5173,
    strictPort: true, // Prevent automatic port changes
    watch: {
      usePolling: true, // Use polling for file watching on Windows
    },
    // Disable HMR websocket in this environment to avoid repeated ws://localhost:5173 connection failures.
    hmr: false,
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
