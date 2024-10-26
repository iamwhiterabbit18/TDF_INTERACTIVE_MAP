import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  

  optimizeDeps: {
    include: ['jwt-decode'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },

  server: {
    host: '0.0.0.0', // Allows access from other devices
    port: 5173,      // Optional: Specify the port
    proxy: {
      '/api': {
        target: 'http://192.168.18.8:5000', // Your backend address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
  
})
