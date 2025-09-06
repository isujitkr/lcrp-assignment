import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),       // 👈 this makes JSX work
    tailwindcss(), // 👈 this enables Tailwind
  ],
})
