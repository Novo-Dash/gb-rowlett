import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'

const MEDIA = /\.(webp|avif|jpg|jpeg|png|gif|mp4|ico|woff2)$/i

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithms: ['brotliCompress'], exclude: [MEDIA] }),
    compression({ algorithms: ['gzip'], exclude: [MEDIA] }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Build SSR (só para o pré-render da "/"): sem public/, sem hash, sem chunks.
  build: isSsrBuild
    ? { ssr: true, copyPublicDir: false, emptyOutDir: true, rollupOptions: { output: { entryFileNames: '[name].js' } } }
    : {
        target: 'es2020',
        cssMinify: true,
        sourcemap: false,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 300,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor'
            },
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
      },
}))
