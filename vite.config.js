import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
     tailwindcss(),
    react()
  ],
   build: {
    chunkSizeWarningLimit: 1000 // size in KB, e.g. 1000 = 1MB
  }
  
})
