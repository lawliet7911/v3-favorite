import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'src': resolve(__dirname, 'src'),
    },
  },
  base: './',
  server: {
    port: 4000,
    open: true,
    cors: true,
    proxy: {
      '^.api': {
        target: 'http://192.168.0.104:5656',
        ws: true,
        secure: false,
      },
    },
  },
})
