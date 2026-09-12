(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  await wait(2500)

  const nav = performance.getEntriesByType('navigation')[0]
  const paints = Object.fromEntries(
    performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]),
  )
  const lcp = window.__lcp ? Math.round(window.__lcp) : null
  const lcpEl = window.__lcpEl
  const cls = window.__cls || 0

  const res = performance.getEntriesByType('resource')
  const group = (re) =>
    res.filter((r) => re.test(r.name)).reduce((a, r) => a + (r.encodedBodySize || 0), 0)

  return JSON.stringify(
    {
      firstPaint: paints['first-paint'] ?? null,
      firstContentfulPaint: paints['first-contentful-paint'] ?? null,
      largestContentfulPaint: lcp,
      lcpElement: lcpEl,
      cumulativeLayoutShift: +cls.toFixed(4),
      domInteractive: Math.round(nav.domInteractive),
      transferredKB: {
        html: Math.round((nav.encodedBodySize || 0) / 1024),
        css: Math.round(group(/\.css/) / 1024),
        jsCritical: Math.round(group(/assets\/index-.*\.js/) / 1024),
        fonts: Math.round(group(/\.woff2/) / 1024),
        images: Math.round(group(/\.(png|jpe?g|webp|avif|svg)/) / 1024),
        threeChunk: Math.round(group(/WeaveScene/) / 1024),
      },
      requests: res.length,
    },
    null,
    1,
  )
})()
