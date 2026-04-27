import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/CareConnect-frontend/',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
