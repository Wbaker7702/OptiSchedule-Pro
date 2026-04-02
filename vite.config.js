import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // bind ONLY to localhost
    port: 3000,
    strictPort: true    // fail if port 3000 is busy
  }
});
