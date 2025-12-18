import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Per Gemini API guidelines, the API key is expected to be in process.env.
    // This line makes it available in the client-side code during development and build.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
