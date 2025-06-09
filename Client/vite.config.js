import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/e-commerce-project/' : '/',
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})
