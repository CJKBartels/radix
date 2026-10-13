import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Only look for tests in src/, so the spikes' own files are never picked up.
    include: ['src/**/*.test.js'],
  },
})
