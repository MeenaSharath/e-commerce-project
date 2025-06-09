import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  base: process.env.VITE_ENV_TARGET === 'github' ? '/e-commerce-project/' : '/',
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})
