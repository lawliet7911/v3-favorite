/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import * as dotenv from 'dotenv'
import viteEslint from 'vite-plugin-eslint'
import { configDefaults } from 'vitest/config'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export default defineConfig({
  plugins: [
    vue(),
    viteEslint({
      failOnError: false
    })
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src')
    }
  },
  base: './',
  test: { exclude: [...configDefaults.exclude, '.husky'] },
  server: {
    host: true,
    cors: true,
    proxy: {
      '^.api': {
        target: process.env.API_URL,
        ws: true,
        secure: false
      }
    }
  }
})
