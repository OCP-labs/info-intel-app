import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      port: 5500,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        '/auth': {
          target: env.VITE_API_AUTH_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/auth/, "")
        }
      }
    }
  }
})