import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': env
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
    server: {
      proxy: {
        '/.netlify/functions': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/\.netlify\/functions/, '')
        }
      }
    }
  };
});