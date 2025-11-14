import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  server: {
    proxy: {
      '/api':'http://app:5000',
    },
  },
  plugins: [react()],
});
