import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://byteweave.studio'

/**
 * Renders every route to static HTML.
 *
 * This is the whole SEO story for a Vite SPA on GitHub Pages: without it the
 * server sends an empty <div id="root">, which is all that crawlers and the
 * LinkedIn card scraper (which does not run JS) would ever see.
 *
 * Each route is written as <path>/index.html so GitHub Pages serves it at a
 * clean URL with no redirect.
 */
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf-8')
if (!template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-html--> placeholder')
}

const { render, ALL_PATHS, LLMS_TXT, LLMS_FULL_TXT, RSS_XML, REDIRECTS } = await import(
  resolve(root, 'dist-ssr/entry-server.js'),
)

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* ── head rewriting ───────────────────────────────────────────────
   Every helper below throws when its target is missing. An earlier version
   matched `<meta name="description" content="` as a literal string, which
   silently did nothing against the template's multi-line formatting — so
   all 25 routes shipped with the homepage's description, og:description and
   twitter:description. Failing the build is the only way that stays fixed. */

/** Rewrites a <meta> by name/property, whatever its formatting. */
function setMeta(html, key, value, { optional = false } = {}) {
  let hit = false
  const out = html.replace(/<meta\b[^>]*>/g, (tag) => {
    const m = tag.match(/(?:name|property)\s*=\s*"([^"]*)"/)
    if (!m || m[1] !== key) return tag
    hit = true
    return /content\s*=\s*"/.test(tag)
      ? tag.replace(/content\s*=\s*"[^"]*"/, `content="${esc(value)}"`)
      : tag.replace(/\s*\/?>$/, ` content="${esc(value)}" />`)
  })
  if (!hit && !optional) throw new Error(`prerender: no <meta ${key}> in the template`)
  return out
}

/** Deletes a <meta> outright — used to strip og:url from the 404 shell. */
function dropMeta(html, key) {
  return html.replace(/[ \t]*<meta\b[^>]*>\n?/g, (tag) => {
    const m = tag.match(/(?:name|property)\s*=\s*"([^"]*)"/)
    return m && m[1] === key ? '' : tag
  })
}

function setLink(html, rel, href) {
  const re = new RegExp(`(<link\\b[^>]*rel="${rel}"[^>]*href=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`prerender: no <link rel="${rel}"> in the template`)
  return html.replace(re, `$1${href}$2`)
}

function dropLink(html, rel) {
  return html.replace(new RegExp(`[ \\t]*<link\\b[^>]*rel="${rel}"[^>]*>\\n?`, 'g'), '')
}

function setTitle(html, title) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error('prerender: no <title>')
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
}

function appendHead(html, lines) {
  if (!lines.length) return html
  return html.replace('</head>', `${lines.map((l) => `    ${l}`).join('\n')}\n  </head>`)
}

/**
 * The graph is built in src/seo.ts and injected here rather than rendered by
 * React, so it sits in <head> and never ships in the client bundle. `<` is
 * escaped because a "</script>" inside a JSON string would close the tag.
 */
function applyJsonLd(html, meta) {
  if (!meta.jsonLd) return html
  const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')
  return appendHead(html, [`<script type="application/ld+json">${json}</script>`])
}

function applyMeta(html, meta) {
  const url = `${SITE}${meta.path === '/' ? '/' : meta.path}`
  let out = setTitle(html, meta.title)

  out = setMeta(out, 'description', meta.description)
  out = setMeta(out, 'og:title', meta.title)
  out = setMeta(out, 'og:description', meta.description)
  out = setMeta(out, 'og:type', meta.ogType ?? 'website')
  out = setMeta(out, 'twitter:title', meta.title)
  out = setMeta(out, 'twitter:description', meta.description)
  // og:image / twitter:image and their alt text stay as the template sets
  // them: every page shares one social card, so alt text naming the page
  // would describe something the image does not contain.

  if (meta.noindex) {
    // A 404 shell has no canonical address, so it claims none.
    out = setMeta(out, 'robots', 'noindex, follow')
    out = dropMeta(out, 'og:url')
    out = dropLink(out, 'canonical')
  } else {
    out = setLink(out, 'canonical', url)
    out = setMeta(out, 'og:url', url)
  }

  // article:* only means anything alongside og:type=article. Other pages
  // carry their dates in the JSON-LD WebPage node instead.
  if (meta.ogType === 'article') {
    out = appendHead(out, [
      ...(meta.datePublished
        ? [`<meta property="article:published_time" content="${esc(meta.datePublished)}" />`]
        : []),
      ...(meta.lastmod
        ? [`<meta property="article:modified_time" content="${esc(meta.lastmod)}" />`]
        : []),
    ])
  }

  return applyJsonLd(out, meta)
}

const written = []
const metaByPath = new Map()
for (const path of ALL_PATHS) {
  const { html: app, meta } = render(path)
  metaByPath.set(path, meta)
  const page = applyMeta(template, meta).replace('<!--app-html-->', app)
  const outDir = path === '/' ? resolve(root, 'dist') : resolve(root, 'dist', path.slice(1))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), page)
  written.push([path, Buffer.byteLength(page)])
}

/* Two pages sharing a description is the failure this build has already
   shipped once. Catch it here rather than in Search Console. */
for (const field of ['title', 'description']) {
  const seen = new Map()
  for (const [path, meta] of metaByPath) {
    const prev = seen.get(meta[field])
    if (prev) throw new Error(`prerender: ${path} and ${prev} share a ${field}`)
    seen.set(meta[field], path)
  }
}

// GitHub Pages serves 404.html for anything unmatched; ship the shell so a
// mistyped deep link still boots the app and renders the real not-found page.
const { html: nf, meta: nfMeta } = render('/__not_found__')
writeFileSync(
  resolve(root, 'dist/404.html'),
  applyMeta(template, nfMeta).replace('<!--app-html-->', nf),
)

// Sitemap must list exactly what was built.
const priority = (p) => (p === '/' ? '1.0' : p.split('/').length > 2 ? '0.7' : '0.9')
writeFileSync(
  resolve(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    ALL_PATHS.map((p) => {
      const lastmod = metaByPath.get(p)?.lastmod
      if (!lastmod) throw new Error(`prerender: ${p} has no lastmod for the sitemap`)
      return `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority(p)}</priority>\n  </url>`
    }).join('\n') +
    `\n</urlset>\n`,
)

/* The .html URLs the current static site has indexed. See REDIRECTS in
   src/seo.ts for why two shapes are needed. */
let aliased = 0
let stubbed = 0
for (const [from, to] of Object.entries(REDIRECTS)) {
  const target = `${SITE}${to}`
  const twin = from.replace(/\.html$/, '')
  // Pages resolves an extension-less request by trying <path>.html first,
  // so that is the filename every one of these has to be written under.
  const file = from.endsWith('.html') ? from : `${from}.html`

  if (metaByPath.has(twin)) {
    // Collides with a real route directory: ship the page itself, not a
    // bounce, so the file cannot hijack its own clean URL.
    const { html: app, meta } = render(twin)
    writeFileSync(
      resolve(root, `dist${file}`),
      applyMeta(template, meta).replace('<!--app-html-->', app),
    )
    aliased++
    continue
  }

  writeFileSync(
    resolve(root, `dist${file}`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Moved to ${esc(target)}</title>
    <link rel="canonical" href="${esc(target)}" />
    <meta http-equiv="refresh" content="0; url=${esc(target)}" />
    <meta name="robots" content="noindex, follow" />
    <script>location.replace(${JSON.stringify(target)})</script>
  </head>
  <body>
    <p>This page has moved to <a href="${esc(target)}">${esc(target)}</a>.</p>
  </body>
</html>
`,
  )
  stubbed++
}

// llmstxt.org: an index for LLM crawlers, plus the prose in one fetch.
writeFileSync(resolve(root, 'dist/llms.txt'), LLMS_TXT)
writeFileSync(resolve(root, 'dist/llms-full.txt'), LLMS_FULL_TXT)
writeFileSync(resolve(root, 'dist/rss.xml'), RSS_XML)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`\n  prerendered ${written.length} routes:`)
for (const [p, bytes] of written) {
  console.log(`    ${p.padEnd(38)} ${(bytes / 1024).toFixed(1)} kB`)
}
console.log(
  `  wrote 404.html, sitemap.xml, rss.xml, llms.txt, llms-full.txt and ` +
    `${aliased} legacy aliases and ${stubbed} redirect stubs\n`,
)
