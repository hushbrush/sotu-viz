import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'esnext', // Ensures modern features like top-level await are supported
      },
  
  base: '/sotu-viz/'
})