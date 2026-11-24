import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Production is served from GitHub Pages at mouraluck.github.io/Portfolio/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Portfolio/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
}))
