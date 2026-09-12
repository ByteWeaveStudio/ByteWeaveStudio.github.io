/** Keyboard-accessibility check driven through real CDP key events. */
import { spawn } from 'node:child_process'

const url = process.argv[2] ?? 'http://localhost:4173/'
const W = +(process.argv[3] ?? 390)
const PORT = 9800 + Math.floor(Math.random() * 300)
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars',
   '--no-first-run', `--user-data-dir=/tmp/kbd-${PORT}`, `--window-size=${W},844`, 'about:blank'],
  { stdio: 'ignore' },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const p = t.find((x) => x.type === 'page')
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl
    } catch {}
    await sleep(120)
  }
  throw new Error('no endpoint')
}
const ws = new WebSocket(await endpoint())
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id)
    pending.delete(m.id)
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)
  }
}
const send = (method, params = {}) =>
  new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params })) })
const evaluate = async (e) =>
  (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value

await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 844, deviceScaleFactor: 1, mobile: W < 768 })
await send('Page.navigate', { url })
await sleep(2200)

const key = async (k, code, vk, text) => {
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', {
      type, key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
      ...(text && type === 'keyDown' ? { text } : {}),
    })
  }
  await sleep(90)
}
const tab = () => key('Tab', 'Tab', 9)
const esc = () => key('Escape', 'Escape', 27)
const enter = () => key('Enter', 'Enter', 13, '\r')

const describe = `(() => {
  const a = document.activeElement
  if (!a || a === document.body) return { tag: 'BODY' }
  const cs = getComputedStyle(a)
  const r = a.getBoundingClientRect()
  return {
    tag: a.tagName,
    text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 30),
    outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
    visible: r.width > 0 && r.height > 0,
    inSheet: !!a.closest('#mobile-nav'),
  }
})()`

const results = { viewport: W, tabOrder: [], focusRing: { ok: 0, missing: [] }, sheet: {} }
for (let i = 0; i < 6; i++) {
  await tab()
  const d = await evaluate(describe)
  results.tabOrder.push(`${d.tag}: ${d.text}`)
  if (d.tag !== 'BODY') {
    if (d.outline) results.focusRing.ok++
    else results.focusRing.missing.push(`${d.tag}: ${d.text}`)
  }
}

if (W < 768) {
  // Focus the menu trigger, open it, and confirm the trap + Escape behaviour.
  await evaluate(`document.querySelector('[aria-controls=mobile-nav]').focus()`)
  await enter()
  await sleep(500)
  results.sheet.opened = await evaluate(`!document.querySelector('#mobile-nav').hidden`)
  results.sheet.focusMovedInside = (await evaluate(describe))?.inSheet ?? false

  // Tab past the end: focus must wrap, never escape the sheet.
  let escaped = false
  for (let i = 0; i < 14; i++) {
    await tab()
    const d = await evaluate(describe)
    if (d.tag !== 'BODY' && !d.inSheet) escaped = true
  }
  results.sheet.focusTrapped = !escaped

  await esc()
  await sleep(450)
  results.sheet.closedOnEscape = await evaluate(`document.querySelector('#mobile-nav').hidden`)
  results.sheet.focusReturnedToTrigger = await evaluate(
    `document.activeElement?.getAttribute('aria-controls') === 'mobile-nav'`,
  )
  results.sheet.scrollUnlocked = await evaluate(`document.body.style.overflow !== 'hidden'`)
}

console.log(JSON.stringify(results, null, 1))
ws.close(); chrome.kill(); process.exit(0)
