import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/',  // Absolute root for Vercel
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  // Force absolute paths in HTML output
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'html') {
      return '/' + filename.replace(/^\.\//, '').replace(/^\/\.\//, '/')
    }
    return filename
  }
})
