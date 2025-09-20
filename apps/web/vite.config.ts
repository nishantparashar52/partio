import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/partio/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }

})
