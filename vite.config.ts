import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const dotenv = require('dotenv');

dotenv.config({path:`.env.${process.env.NODE_ENV}`}); 

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
  base: './',
  server: {
    host: true,
    open: true,
    cors: true,
    proxy: {
      '^.api': {
        target: process.env.API_URL,
        ws: true,
        secure: false,
      },
    },
  },
})
