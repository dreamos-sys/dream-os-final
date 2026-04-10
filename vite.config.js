import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/dream/',
  plugins: [svelte()],
  build: {
    target: 'esnext',
    minify: false,
    cssMinify: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [] // No external modules
    }
  }
})
