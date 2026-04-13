import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/',  // Absolute base for Vercel root
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
  // 🔥 FORCE ABSOLUTE PATHS IN HTML OUTPUT
  renderBuiltUrl(filename, { hostType, type, ssr }) {
    if (hostType === 'html') {
      // Force absolute path for HTML references
      return '/' + filename.replace(/^\.\//, '')
    }
    return filename
  },
  // Prevent SSR issues
  ssr: { noExternal: true }
})
