/**
 * Minimal Chrome DevTools Protocol driver — screenshots and page probing
 * with no puppeteer dependency (Node 22 ships a global WebSocket).
 *
 * usage: node scripts/shot.mjs <url> [--out f.png] [--w 1440] [--h 900]
 *                              [--scrollTo '#process'] [--full] [--reduced]
 *                              [--eval 'expression']
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const argv = process.argv.slice(2)
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`)
  return i === -1 ? d : argv[i + 1]
}
const has = (k) => argv.includes(`--${k}`)

const url = argv[0]
const out = arg('out', '/tmp/shot.png')
const W = +arg('w', 1440)
const H = +arg('h', 900)
const PORT = 9222 + Math.floor(Math.random() * 500)

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const flags = [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  // Software WebGL, so the canvas path can actually be exercised headlessly.
  ...(has('webgl')
    ? ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader']
    : ['--disable-gpu']),
  '--hide-scrollbars',
  '--no-first-run',
  '--user-data-dir=/tmp/cdp-profile-' + PORT,
  `--window-size=${W},${H}`,
]
if (has('reduced')) flags.push('--force-prefers-reduced-motion')

const chrome = spawn(CHROME, [...flags, 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const tabs = await r.json()
      const page = tabs.find((t) => t.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(120)
  }
  throw new Error('chrome did not expose a debugging endpoint')
}

const ws = new WebSocket(await endpoint())
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id
    pending.set(n, { resolve, reject })
    ws.send(JSON.stringify({ id: n, method, params }))
  })

const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
  return r.result?.value
}

await send('Page.enable')
await send('Runtime.enable')

// Console errors and uncaught exceptions are reported at the end — a thrown
// error inside a render loop is otherwise completely invisible in a screenshot.
const problems = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails
    problems.push('EXCEPTION: ' + (d.exception?.description ?? d.text ?? '').split('\n').slice(0, 3).join(' | '))
  }
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
    problems.push(
      m.params.type.toUpperCase() + ': ' +
        m.params.args.map((a) => a.description ?? a.value ?? a.type).join(' ').slice(0, 220),
    )
  }
})
await send('Emulation.setDeviceMetricsOverride', {
  width: W, height: H, deviceScaleFactor: 1, mobile: false,
})
// Register before page scripts so LCP/CLS are actually observed.
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__lcp = 0; window.__lcpEl = null; window.__cls = 0;
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = e.element?.tagName || null }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  `,
})

await send('Page.navigate', { url })
await sleep(+arg('wait', 1600))

const scrollTo = arg('scrollTo')
if (scrollTo) {
  await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(scrollTo)});
    if (!el) return 'NOT FOUND';
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'instant' });
    return y;
  })()`)
  await sleep(1200)
}

// Applies whether or not we scrolled: a lazily-mounted canvas starts its
// animation when it mounts, not when the page loads, so --wait alone is not
// enough to capture a settled 3D scene.
if (arg('settle')) await sleep(+arg('settle'))

let evalExpr = arg('eval')
const evalFile = arg('evalFile')
if (evalFile) evalExpr = (await import('node:fs')).readFileSync(evalFile, 'utf-8')
if (evalExpr) console.log(JSON.stringify(await evaluate(evalExpr), null, 2))

// Full-page capture is tiled by scrolling rather than done in one shot:
// captureBeyondViewport mis-stitches past roughly 8000px, and resizing the
// viewport to the document height breaks every vh-based rule on the page.
if (has('full')) {
  const { writeFileSync: wf, mkdtempSync, rmSync } = await import('node:fs')
  const { execFileSync } = await import('node:child_process')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')

  const total = await evaluate('document.documentElement.scrollHeight')
  const dir = mkdtempSync(join(tmpdir(), 'tiles-'))
  const tiles = []

  for (let y = 0, i = 0; y < total; y += H, i++) {
    const h = Math.min(H, total - y)
    await evaluate(`window.scrollTo({ top: ${y}, behavior: 'instant' });
      document.querySelector('header').style.visibility = ${i === 0 ? "''" : "'hidden'"};
      'ok'`)
    await sleep(320)
    // clip is in PAGE coordinates, not viewport coordinates — scrolling alone
    // does not move it. Scroll to trigger reveals, then clip by page offset.
    const t = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y, width: W, height: h, scale: 1 },
    })
    const f = join(dir, `t${String(i).padStart(3, '0')}.png`)
    wf(f, Buffer.from(t.data, 'base64'))
    tiles.push(f)
  }

  execFileSync('magick', [...tiles, '-append', '+repage', out])
  rmSync(dir, { recursive: true, force: true })
  console.log(`wrote ${out} (${tiles.length} tiles, ${total}px)`)
  ws.close()
  chrome.kill()
  process.exit(0)
}

let clip

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  ...(clip ? { clip, captureBeyondViewport: true } : {}),
})
writeFileSync(out, Buffer.from(shot.data, 'base64'))
console.log(`wrote ${out}`)

if (problems.length) {
  console.error(`\n  ${problems.length} console problem(s):`)
  for (const p of [...new Set(problems)].slice(0, 10)) console.error('    ' + p)
}

ws.close()
chrome.kill()
process.exit(0)
