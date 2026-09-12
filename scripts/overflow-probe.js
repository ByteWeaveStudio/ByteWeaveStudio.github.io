(() => {
  const vw = document.documentElement.clientWidth
  const offenders = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' || cs.overflow === 'hidden') continue
    if (r.right - vw > 1 || r.left < -1) {
      offenders.push({
        tag: el.tagName,
        cls: (el.className?.toString?.() || '').slice(0, 44),
        over: Math.round(r.right - vw),
      })
    }
  }
  return JSON.stringify({
    viewport: vw,
    docScrollWidth: document.documentElement.scrollWidth,
    horizontalScroll: document.documentElement.scrollWidth > vw + 1,
    offenders: offenders.slice(0, 5),
  })
})()
