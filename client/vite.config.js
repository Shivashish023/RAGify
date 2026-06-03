import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the current directory, filtering for variables starting with VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Expose loaded environment variables under process.env
      'process.env': env
    }
  }
})
