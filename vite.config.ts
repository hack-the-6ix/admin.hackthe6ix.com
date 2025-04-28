import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
  },
});
