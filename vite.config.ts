import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Makes `vite preview` behave like GitHub Pages: resolve /foo to
 * /foo/index.html, and serve 404.html for anything unmatched.
 *
 * Without this, preview's SPA fallback returns the homepage for every path,
 * which hides whether the per-route prerender actually worked.
 */
function githubPagesPreview(): Plugin {
  return {
    name: 'github-pages-preview',
    // Registered directly rather than in a returned function, so it runs
    // before Vite's own SPA fallback rather than after it.
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '/').split('?')[0]
        if (url.includes('.')) return next()
        const file = join(process.cwd(), 'dist', url, 'index.html')
        if (existsSync(file)) {
          res.setHeader('Content-Type', 'text/html')
          res.end(readFileSync(file))
          return
        }
        const notFound = join(process.cwd(), 'dist', '404.html')
        if (existsSync(notFound)) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html')
          res.end(readFileSync(notFound))
          return
        }
      next()
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), githubPagesPreview()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    // No manualChunks for three: naming it as a manual chunk made Vite treat
    // it as an entry-adjacent chunk and emit <link rel="modulepreload"> for
    // it, which downloaded 238 kB of WebGL on every visit — mobile included —
    // defeating the runtime gating in WeaveVisual. Letting Vite split the
    // dynamic import on its own keeps the chunk genuinely lazy.
  },
})
