import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Bind IPv4 explicitly — on Windows `localhost` otherwise resolves to ::1 only.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules[\\/](three|@react-three)/.test(id)) return 'three';
          if (/node_modules[\\/](gsap|lenis)/.test(id)) return 'motion';
        },
      },
    },
  },
});
