(() => {
  const issues = []
  const advisory = []
  const ok = []

  // ── contrast ──────────────────────────────────────────────────────────
  const lum = (r, g, b) => {
    const f = (v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number)
  const ratio = (fg, bg) => {
    const [a, b] = [lum(...parse(fg)), lum(...parse(bg))]
    const [hi, lo] = a > b ? [a, b] : [b, a]
    return (hi + 0.05) / (lo + 0.05)
  }
  const bgOf = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor
      if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) return c
      n = n.parentElement
    }
    return 'rgb(247,247,245)'
  }

  const textNodes = [...document.querySelectorAll('p,h1,h2,h3,h4,a,li,span,dt,dd,figcaption,text')]
    .filter((el) => el.textContent.trim() && el.offsetParent !== null && !el.querySelector('p,h1,h2,h3,a'))
  const lowContrast = []
  for (const el of textNodes) {
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize)
    const weight = parseInt(cs.fontWeight) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    const r = ratio(cs.color, bgOf(el))
    if (r < need) {
      lowContrast.push({
        text: el.textContent.trim().slice(0, 42),
        ratio: +r.toFixed(2),
        need,
        size: Math.round(size),
      })
    }
  }
  if (lowContrast.length) issues.push({ check: 'contrast', count: lowContrast.length, sample: lowContrast.slice(0, 8) })
  else ok.push('contrast: all text meets WCAG AA')

  // ── headings ──────────────────────────────────────────────────────────
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
  const h1s = hs.filter((h) => h.tagName === 'H1')
  if (h1s.length !== 1) issues.push({ check: 'h1-count', count: h1s.length })
  else ok.push('exactly one h1')
  let prev = 1
  const skips = []
  for (const h of hs) {
    const lvl = +h.tagName[1]
    if (lvl > prev + 1) skips.push(`${h.tagName} after H${prev}: "${h.textContent.trim().slice(0, 30)}"`)
    prev = lvl
  }
  if (skips.length) issues.push({ check: 'heading-skips', skips })
  else ok.push('no heading level skips')

  // ── landmarks / lang ──────────────────────────────────────────────────
  const marks = { main: !!document.querySelector('main'), header: !!document.querySelector('header'), footer: !!document.querySelector('footer'), nav: document.querySelectorAll('nav').length }
  if (!marks.main || !marks.header || !marks.footer) issues.push({ check: 'landmarks', marks })
  else ok.push(`landmarks present (${marks.nav} nav)`)
  if (!document.documentElement.lang) issues.push({ check: 'html-lang-missing' })
  else ok.push(`lang="${document.documentElement.lang}"`)

  // ── names ─────────────────────────────────────────────────────────────
  const named = (el) =>
    (el.getAttribute('aria-label') || el.textContent || '').trim() ||
    el.querySelector('.sr-only,title,img[alt]')
  const unnamedLinks = [...document.querySelectorAll('a[href]')].filter((a) => !named(a)).length
  const unnamedButtons = [...document.querySelectorAll('button')].filter((b) => !named(b)).length
  if (unnamedLinks || unnamedButtons) issues.push({ check: 'unnamed-controls', unnamedLinks, unnamedButtons })
  else ok.push('all links and buttons have accessible names')

  const noAlt = [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null)
  if (noAlt.length) issues.push({ check: 'img-missing-alt', count: noAlt.length })
  else ok.push(`${document.querySelectorAll('img').length} images all have alt`)

  // ── duplicate ids ─────────────────────────────────────────────────────
  const seen = {}, dupes = []
  for (const el of document.querySelectorAll('[id]')) {
    if (seen[el.id]) dupes.push(el.id)
    seen[el.id] = 1
  }
  if (dupes.length) issues.push({ check: 'duplicate-ids', dupes })
  else ok.push('no duplicate ids')

  // ── tap targets (mobile only) ─────────────────────────────────────────
  if (innerWidth < 768) {
    // SC 2.5.8 exempts a target "in a sentence or its associated text
    // block". A link whose parent carries prose either side of it is that
    // case, and flagging it produces findings that can only be resolved by
    // making body copy worse.
    const inlineInProse = (el) => {
      const parent = el.parentElement
      if (!parent || el.tagName === 'BUTTON') return false
      const own = (el.textContent || '').trim()
      const around = (parent.textContent || '').trim()
      return around.length > own.length + 3
    }
    const small = [...document.querySelectorAll('a[href],button')]
      .filter((el) => el.offsetParent !== null && !inlineInProse(el))
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0)
      .map(({ el, r }) => ({ text: (el.textContent || '').trim().slice(0, 26), h: Math.round(r.height), w: Math.round(r.width), btn: el.tagName === 'BUTTON' }))
    const belowAA = small.filter((t) => t.h < 24 || t.w < 24)
    const buttonsBelow44 = small.filter((t) => t.btn && (t.h < 44 || t.w < 44))
    if (belowAA.length) issues.push({ check: 'tap-target-below-WCAG-2.2-AA-24px', count: belowAA.length, sample: belowAA.slice(0, 8) })
    else ok.push('all tap targets >= 24px (WCAG 2.2 AA, inline links exempt)')
    // 44px is SC 2.5.5 (AAA), not the AA bar — advisory, not a failure.
    if (buttonsBelow44.length) advisory.push({ check: 'button-below-44px-AAA', sample: buttonsBelow44.slice(0, 5) })
    else ok.push('all buttons >= 44px')
  }

  return JSON.stringify({ viewport: innerWidth, passed: ok, issues, advisory }, null, 1)
})()
