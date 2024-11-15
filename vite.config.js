import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500,
    proxy: {
      '/api': {
        target: 'https://mrg-mtm-gateway-api.test.ca.opentext.com/mtm-gateway-api/services/mrgservice/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      '/auth': {
        target: 'https://otdsauth.test.ca.opentext.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, "")
      }
    }
  }
})