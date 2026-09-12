/**
 * Static SEO / machine-readability audit of dist/.
 *
 * Everything here is checked against the built output rather than the
 * source, because the failures that matter are the ones that survive the
 * prerender — the whole site once shipped with a single shared meta
 * description that every source file looked correct about.
 *
 *   node scripts/seo-audit.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'

const DIST = 'dist'
const SITE = 'https://byteweave.studio'
const fails = []
const warns = []
const fail = (m) => fails.push(m)
const warn = (m) => warns.push(m)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'))
const routeFiles = htmlFiles.filter((f) => f.endsWith('index.html'))
const routeOf = (f) => '/' + relative(DIST, dirname(f)).replace(/^\.$/, '')

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))?.[1]
const metas = (html) =>
  Object.fromEntries(
    [...html.matchAll(/<meta\b[^>]*>/g)]
      .map(([t]) => [attr(t, 'name') ?? attr(t, 'property'), attr(t, 'content')])
      .filter(([k]) => k),
  )
const one = (html, re) => html.match(re)?.[1]
const count = (html, re) => (html.match(re) ?? []).length

/* ── per-route head ─────────────────────────────────────────────── */
const seenTitle = new Map()
const seenDesc = new Map()
const rows = []

for (const f of routeFiles) {
  const route = routeOf(f)
  const html = readFileSync(f, 'utf-8')
  const m = metas(html)
  const title = one(html, /<title>([\s\S]*?)<\/title>/)
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/)
  const expected = SITE + (route === '/' ? '/' : route)

  if (!title) fail(`${route}: no <title>`)
  if (!m.description) fail(`${route}: no meta description`)
  if (canonical !== expected) fail(`${route}: canonical is ${canonical}, expected ${expected}`)
  if (m['og:url'] !== expected) fail(`${route}: og:url is ${m['og:url']}`)
  for (const k of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'og:type',
                   'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
                   'twitter:image:alt', 'robots'])
    if (!m[k]) fail(`${route}: missing ${k}`)
  if (m.description !== m['og:description']) warn(`${route}: description and og:description differ`)

  if (seenTitle.has(title)) fail(`${route} and ${seenTitle.get(title)} share a title`)
  if (seenDesc.has(m.description))
    fail(`${route} and ${seenDesc.get(m.description)} share a description`)
  seenTitle.set(title, route)
  seenDesc.set(m.description, route)

  if (title.length > 60) warn(`${route}: title is ${title.length} chars (SERPs cut near 60)`)
  if (m.description.length > 165 || m.description.length < 90)
    warn(`${route}: description is ${m.description.length} chars`)

  const h1 = count(html, /<h1[ >]/g)
  if (h1 !== 1) fail(`${route}: ${h1} <h1> elements`)
  if (!/<main[ >]/.test(html)) fail(`${route}: no <main> landmark`)
  if (!/<html lang="[a-z-]+"/.test(html)) fail(`${route}: no lang on <html>`)
  if (!/application\/rss\+xml/.test(html)) fail(`${route}: no feed autodiscovery link`)

  // Heading order: no level skipped.
  const levels = [...html.matchAll(/<h([1-6])[ >]/g)].map((x) => +x[1])
  for (let i = 1; i < levels.length; i++)
    if (levels[i] - levels[i - 1] > 1)
      warn(`${route}: heading jumps h${levels[i - 1]} → h${levels[i]}`)

  // Prerendered prose, i.e. what a crawler that runs no JS actually sees.
  const words = readFileSync(f, 'utf-8')
    .split('<body>')[1]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  if (words < 200) fail(`${route}: only ${words} words in the prerendered HTML`)

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(([t]) => t)
  for (const img of imgs) if (attr(img, 'alt') === undefined) fail(`${route}: <img> with no alt`)

  rows.push({ route, title: title.length, desc: m.description.length, words, imgs: imgs.length })
}

/* ── structured data ────────────────────────────────────────────── */
const defined = new Set()
const referenced = new Map()
const seenTypes = new Set()

function walkLd(node) {
  if (Array.isArray(node)) return node.forEach(walkLd)
  if (!node || typeof node !== 'object') return
  const keys = Object.keys(node)
  if (node['@id'] && node['@type']) defined.add(node['@id'])
  else if (keys.length === 1 && keys[0] === '@id')
    referenced.set(node['@id'], (referenced.get(node['@id']) ?? 0) + 1)
  if (node['@type']) [node['@type']].flat().forEach((t) => seenTypes.add(t))
  Object.values(node).forEach(walkLd)
}

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf-8')
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let parsed
    try {
      parsed = JSON.parse(raw.replace(/\\u003c/g, '<'))
    } catch (e) {
      fail(`${relative(DIST, f)}: JSON-LD does not parse — ${e.message}`)
      continue
    }
    walkLd(parsed)
    for (const node of parsed['@graph'] ?? [parsed]) {
      const type = [node['@type']].flat()[0]
      if (type === 'BlogPosting' || type === 'TechArticle') {
        for (const k of ['headline', 'image', 'datePublished', 'author', 'publisher'])
          if (!node[k]) fail(`${relative(DIST, f)}: ${type} missing ${k}`)
        if (node.headline?.length > 110)
          fail(`${relative(DIST, f)}: headline over Google's 110-char limit`)
      }
      if (type === 'Organization')
        for (const k of ['name', 'url', 'logo'])
          if (!node[k]) fail(`Organization missing ${k}`)
    }
  }
}
for (const [id, n] of referenced)
  if (!defined.has(id)) fail(`JSON-LD: @id ${id} referenced ${n}× but never defined`)

/* ── crawl surfaces ─────────────────────────────────────────────── */
const need = ['robots.txt', 'sitemap.xml', 'rss.xml', 'llms.txt', 'llms-full.txt', '404.html', 'CNAME', '.nojekyll']
for (const f of need) if (!existsSync(join(DIST, f))) fail(`dist/${f} is missing`)

const robots = readFileSync(join(DIST, 'robots.txt'), 'utf-8')
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt does not point at the sitemap')
if (/Disallow: \/\s*$/m.test(robots)) fail('robots.txt disallows the whole site')

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const built = new Set(routeFiles.map(routeOf))
for (const loc of locs) {
  const p = loc.replace(SITE, '') || '/'
  if (!built.has(p)) fail(`sitemap lists ${p} but nothing was built there`)
}
for (const p of built) if (!locs.includes(SITE + p)) fail(`${p} is built but not in the sitemap`)
if (new Set(locs).size !== locs.length) fail('sitemap has duplicate <loc> entries')
for (const [, d] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) fail(`sitemap lastmod "${d}" is not ISO`)

// 404 must not claim to be a real page.
const nf = metas(readFileSync(join(DIST, '404.html'), 'utf-8'))
if (!nf.robots?.includes('noindex')) fail('404.html is indexable')
if (readFileSync(join(DIST, '404.html'), 'utf-8').includes('rel="canonical"'))
  fail('404.html declares a canonical')

// A redirect stub must never sit where it could capture a real route.
for (const f of htmlFiles.filter((x) => !x.endsWith('index.html') && !x.endsWith('404.html'))) {
  const html = readFileSync(f, 'utf-8')
  if (!/http-equiv="refresh"/.test(html)) continue
  const twin = '/' + relative(DIST, f).replace(/\.html$/, '')
  if (built.has(twin)) fail(`${relative(DIST, f)} is a refresh stub shadowing the real route ${twin}`)
  const target = one(html, /<link rel="canonical" href="([^"]*)"/)
  if (target === SITE + twin) fail(`${relative(DIST, f)} redirects to itself`)
}

// Internal links must all resolve.
for (const f of routeFiles) {
  const html = readFileSync(f, 'utf-8')
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const clean = href.replace(/\/$/, '') || '/'
    if (built.has(clean) || existsSync(join(DIST, href)) || existsSync(join(DIST, href + '.html')))
      continue
    fail(`${routeOf(f)} links to ${href}, which does not exist`)
  }
}

/* ── report ─────────────────────────────────────────────────────── */
console.log(`\n  ${routeFiles.length} routes · ${htmlFiles.length} HTML files\n`)
console.log(`  ${'route'.padEnd(46)}${'title'.padStart(6)}${'desc'.padStart(6)}${'words'.padStart(7)}`)
for (const r of rows)
  console.log(`  ${r.route.padEnd(46)}${String(r.title).padStart(6)}${String(r.desc).padStart(6)}${String(r.words).padStart(7)}`)
console.log(`\n  schema.org types: ${[...seenTypes].sort().join(', ')}`)
console.log(`  @id nodes defined: ${defined.size}, all references resolve: ${[...referenced.keys()].every((k) => defined.has(k))}`)

if (warns.length) {
  console.log(`\n  ${warns.length} warnings`)
  for (const w of warns) console.log(`    · ${w}`)
}
if (fails.length) {
  console.log(`\n  ${fails.length} FAILURES`)
  for (const f of fails) console.log(`    ✗ ${f}`)
  process.exit(1)
}
console.log('\n  no failures\n')
