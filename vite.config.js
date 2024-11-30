import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
  ],

  // insert paths/alias here if needed
  resolve:{
    alias:{
      "@utils": path.resolve(__dirname, "./src/Pages/Users/map/Components/utils/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
    },
  },

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
        target: 'http://192.168.18.46:5000', // Your backend address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
  
})
