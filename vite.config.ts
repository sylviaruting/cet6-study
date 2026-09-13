import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { persistProgress } from './persist-plugin.ts'

export default defineConfig({
  plugins: [react(), persistProgress()],
})
