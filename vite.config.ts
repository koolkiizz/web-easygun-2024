import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
      exclude: '',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://prod.easygunny.xyz',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'RestSharp/105.2.3.0',
          Origin: 'http://prod.easygunny.xyz',
          Referer: 'http://prod.easygunny.xyz/',
        },
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', proxyReq, req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
