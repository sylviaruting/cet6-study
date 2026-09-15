import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { persistProgress } from './persist-plugin.ts'

export default defineConfig({
  base: './',
  plugins: [react(), persistProgress()],
})
