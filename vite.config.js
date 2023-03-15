import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
const defineConfig({
  plugins: [vue()],
  server: {
    port: 8000
  }
})

export default defineConfig;