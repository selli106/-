// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Change 'your-repository-name' to your actual repo name
  base: '/BookshELF/', 
  plugins: [react()],
})
