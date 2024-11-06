import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500,
    proxy: {
      '/api': {
        target: 'https://us.api.opentext.com/mtm-riskguard/api/v1',
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