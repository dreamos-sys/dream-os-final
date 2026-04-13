import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/', 
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Memaksa Vite tidak menggunakan relative paths sama sekali
    assetsInlineLimit: 0, 
  },
  experimental: {
    // Cara terbaru untuk force absolute paths di Vite modern
    renderBuiltUrl(filename) {
      return '/' + filename
    }
  }
})
