/**
 * Generated cover art, one per post.
 *
 * No stock photography and no AI illustration — the old site had both and
 * one shipped with garbled text baked into it. Each category gets a motif
 * drawn from its own subject, and the slug seeds a small amount of variation
 * so two posts in the same category never render identically.
 *
 * A post can override this by setting `cover` in posts.ts, which is the
 * intended path once real screenshots or photographs exist.
 */

type Hue = { line: string; solid: string; wash: string }

/** Six stops walked along the logo ramp: #5170fe → #8e6cea → #f568c7. */
const HUES: Record<string, Hue> = {
  'Document AI': { line: '#5170fe', solid: '#1f48ff', wash: '#eef2ff' },
  'Computer vision': { line: '#6d68f4', solid: '#4a41e0', wash: '#f0effe' },
  'LLM engineering': { line: '#8e6cea', solid: '#6f43dc', wash: '#f4f0fd' },
  'Shipping AI': { line: '#a96ae1', solid: '#8a41cc', wash: '#f7f0fc' },
  'Web & mobile': { line: '#cd67d5', solid: '#ab3fb4', wash: '#fbf0fc' },
  MCP: { line: '#f568c7', solid: '#d33f9b', wash: '#fdf0f8' },
}
const FALLBACK: Hue = HUES['Document AI']

/** FNV-1a, so a slug always produces the same cover. */
function seedOf(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — deterministic, so server and client render the same art. */
function rngOf(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const VB = '0 0 640 400'
const SVG = 'h-full w-full'
const SHEET = 'fill-raised stroke-line-strong'

type Draw = (r: () => number, h: Hue) => React.ReactNode

/** A page under field overlays. */
const documentAI: Draw = (r, h) => {
  const rows = 7
  const hot = 1 + Math.floor(r() * 2)
  return (
    <>
      <rect x="96" y="52" width="212" height="296" rx="8" className={SHEET} strokeWidth="1.5" />
      <rect x="124" y="84" width={70 + Math.round(r() * 40)} height="8" rx="4" className="fill-line" />
      {Array.from({ length: rows }, (_, i) => (
        <rect
          key={i}
          x="124"
          y={124 + i * 26}
          width={90 + Math.round(r() * 66)}
          height="7"
          rx="3.5"
          className="fill-line"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="120"
          y={118 + (i * 2 + 1) * 26}
          width={140 + Math.round(r() * 44)}
          height="20"
          rx="4"
          fill={h.wash}
          stroke={i === hot ? h.solid : h.line}
          strokeWidth={i === hot ? 2 : 1.2}
          strokeDasharray={i === hot ? '4 3' : undefined}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="368" y={140 + i * 48} width="152" height="9" rx="4.5" className="fill-line" />
          <rect
            x="368"
            y={140 + i * 48}
            width={i === hot ? 58 : 108 + Math.round(r() * 40)}
            height="9"
            rx="4.5"
            fill={i === hot ? h.solid : h.line}
          />
        </g>
      ))}
    </>
  )
}

/** A frame with detections inside it, placed from the seed. */
const computerVision: Draw = (r, h) => {
  const F = { x: 72, y: 56, w: 496, h: 288 }
  const n = 3 + Math.floor(r() * 2)
  const boxes = Array.from({ length: n }, (_, i) => {
    const w = 84 + r() * 78
    const hgt = 72 + r() * 78
    return {
      x: F.x + 24 + (i / n) * (F.w - 80) + r() * 26,
      y: F.y + 26 + r() * (F.h - hgt - 52),
      w,
      h: hgt,
    }
  })
  const hot = Math.floor(r() * n)
  const band = F.y + 60 + r() * (F.h - 120)
  return (
    <>
      <rect {...{ x: F.x, y: F.y }} width={F.w} height={F.h} rx="8" className={SHEET} strokeWidth="1.5" />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={`v${i}`}
          d={`M${F.x + (i + 1) * (F.w / 8)} ${F.y}V${F.y + F.h}`}
          className="stroke-line"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <path
          key={`h${i}`}
          d={`M${F.x} ${F.y + (i + 1) * (F.h / 5)}H${F.x + F.w}`}
          className="stroke-line"
          strokeWidth="1"
        />
      ))}
      <rect x={F.x} y={band} width={F.w} height="42" fill={h.line} opacity="0.09" />
      {boxes.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="4"
            fill={i === hot ? h.wash : 'none'}
            stroke={i === hot ? h.solid : h.line}
            strokeWidth={i === hot ? 2.4 : 1.6}
          />
          {/* corner ticks read as a tracker rather than a plain rectangle */}
          {[
            [b.x, b.y, 1, 1],
            [b.x + b.w, b.y, -1, 1],
            [b.x, b.y + b.h, 1, -1],
            [b.x + b.w, b.y + b.h, -1, -1],
          ].map(([cx, cy, sx, sy], k) => (
            <path
              key={k}
              d={`M${cx} ${cy + sy * 14}V${cy}H${cx + sx * 14}`}
              fill="none"
              stroke={i === hot ? h.solid : h.line}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          ))}
          {i === hot ? <circle cx={b.x + b.w / 2} cy={b.y + b.h / 2} r="6.5" fill={h.solid} /> : null}
        </g>
      ))}
    </>
  )
}

/** Token rows with one attention arc. Row and token counts follow the seed. */
const llmEngineering: Draw = (r, h) => {
  const rows = 4 + Math.floor(r() * 3)
  const top = 200 - (rows * 54) / 2
  const hot = Math.floor(r() * rows)
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: 3 + Math.floor(r() * 3) }, () => 52 + Math.round(r() * 74)),
  )
  const hotCol = Math.min(1, grid[hot].length - 1)
  let hotX = 84
  for (let j = 0; j < hotCol; j++) hotX += grid[hot][j] + 14
  return (
    <>
      {grid.map((row, i) => {
        let x = 84
        return (
          <g key={i}>
            {row.map((w, j) => {
              const on = i === hot && j === hotCol
              const el = (
                <rect
                  key={j}
                  x={x}
                  y={top + i * 54}
                  width={w}
                  height="30"
                  rx="15"
                  fill={on ? h.solid : h.wash}
                  stroke={on ? h.solid : h.line}
                  strokeWidth="1.4"
                />
              )
              x += w + 14
              return el
            })}
          </g>
        )
      })}
      <path
        d={`M${hotX + 20} ${top + hot * 54} C${hotX + 70} ${top + hot * 54 - 54}, ${hotX + 210} ${top + hot * 54 - 54}, ${hotX + 260} ${top + hot * 54}`}
        fill="none"
        stroke={h.solid}
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />
    </>
  )
}

/** Stages crossing a threshold. The seed picks the profile, not just the noise. */
const shippingAI: Draw = (r, h) => {
  const n = 5 + Math.floor(r() * 3)
  const base = 330
  const shape = Math.floor(r() * 3)
  const heights = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const curve =
      shape === 0
        ? t // climbing
        : shape === 1
          ? 1 - Math.abs(t - 0.45) * 1.9 // peaked
          : 0.35 + Math.sin(t * Math.PI * 1.4) * 0.6 // uneven
    return Math.max(34, Math.round(48 + curve * 190 + r() * 26))
  })
  const threshold = 120 + Math.round(r() * 90)
  const w = Math.min(56, Math.floor(460 / n) - 14)
  const gap = (496 - n * w) / (n + 1)
  return (
    <>
      <path d={`M72 ${base}H568`} className="stroke-line-strong" strokeWidth="1.5" />
      <path
        d={`M72 ${base - threshold}H568`}
        stroke={h.line}
        strokeWidth="1.4"
        strokeDasharray="5 4"
      />
      {heights.map((ht, i) => {
        const over = ht >= threshold
        return (
          <rect
            key={i}
            x={72 + gap + i * (w + gap)}
            y={base - ht}
            width={w}
            height={ht}
            rx="5"
            fill={over ? h.solid : h.wash}
            stroke={over ? h.solid : h.line}
            strokeWidth="1.4"
          />
        )
      })}
    </>
  )
}

/** A browser frame with a phone in front of it. */
const webMobile: Draw = (r, h) => {
  const bars = Array.from({ length: 4 }, () => 90 + Math.round(r() * 130))
  return (
    <>
      <rect x="88" y="60" width="380" height="252" rx="10" className={SHEET} strokeWidth="1.5" />
      <path d="M88 96H468" className="stroke-line" strokeWidth="1.2" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={112 + i * 18} cy="78" r="4.5" className="fill-line-strong" />
      ))}
      {bars.map((w, i) => (
        <rect key={i} x="116" y={126 + i * 30} width={w} height="9" rx="4.5" className="fill-line" />
      ))}
      <rect
        x="118"
        y={126 + 30}
        width={bars[1]}
        height="9"
        rx="4.5"
        fill={h.solid}
        opacity="0.9"
      />
      <rect
        x="392"
        y="132"
        width="140"
        height="228"
        rx="18"
        fill={h.wash}
        stroke={h.solid}
        strokeWidth="1.8"
      />
      <rect x="440" y="146" width="44" height="7" rx="3.5" fill={h.line} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="412"
          y={178 + i * 30}
          width={100 - i * 18}
          height="8"
          rx="4"
          fill={h.line}
          opacity="0.55"
        />
      ))}
    </>
  )
}

/** One host, several connected servers. Count and placement follow the seed. */
const mcp: Draw = (r, h) => {
  const hub = { x: 320, y: 200 }
  const count = 4 + Math.floor(r() * 3)
  const start = r() * Math.PI * 2
  const nodes = Array.from({ length: count }, (_, i) => {
    const a = start + (i / count) * Math.PI * 2
    const rx = 208 + r() * 34
    const ry = 128 + r() * 26
    return { x: hub.x + Math.cos(a) * rx, y: hub.y + Math.sin(a) * ry }
  })
  const hot = Math.floor(r() * count)
  return (
    <>
      {nodes.map((n, i) => (
        <path
          key={`e${i}`}
          d={`M${hub.x} ${hub.y} C${(hub.x + n.x) / 2} ${hub.y}, ${(hub.x + n.x) / 2} ${n.y}, ${n.x} ${n.y}`}
          fill="none"
          stroke={i === hot ? h.solid : h.line}
          strokeWidth={i === hot ? 2.2 : 1.3}
          strokeDasharray={i === hot ? undefined : '5 4'}
          opacity={i === hot ? 1 : 0.65}
        />
      ))}
      <rect
        x={hub.x - 64}
        y={hub.y - 42}
        width="128"
        height="84"
        rx="10"
        fill={h.wash}
        stroke={h.solid}
        strokeWidth="2"
      />
      <rect x={hub.x - 40} y={hub.y - 16} width="80" height="8" rx="4" fill={h.solid} opacity="0.6" />
      <rect x={hub.x - 40} y={hub.y + 2} width="50" height="8" rx="4" fill={h.solid} opacity="0.32" />
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <rect
            x={n.x - 40}
            y={n.y - 26}
            width="80"
            height="52"
            rx="8"
            className={SHEET}
            strokeWidth="1.5"
          />
          <rect
            x={n.x - 22}
            y={n.y - 4}
            width={26 + Math.round(r() * 18)}
            height="7"
            rx="3.5"
            fill={i === hot ? h.solid : h.line}
          />
        </g>
      ))}
    </>
  )
}

const MOTIF: Record<string, Draw> = {
  'Document AI': documentAI,
  'Computer vision': computerVision,
  'LLM engineering': llmEngineering,
  'Shipping AI': shippingAI,
  'Web & mobile': webMobile,
  MCP: mcp,
}

/** Motifs with a strong left/right composition get flipped on some seeds. */
const MIRRORABLE = new Set(['Document AI', 'Web & mobile'])

export function PostCover({
  slug,
  category,
  fit = 'slice',
}: {
  slug: string
  category: string
  /** `slice` fills a card; `meet` shows the whole motif inside a wide banner. */
  fit?: 'slice' | 'meet'
}) {
  const hue = HUES[category] ?? FALLBACK
  const draw = MOTIF[category] ?? documentAI
  const rand = rngOf(seedOf(slug))
  const flip = MIRRORABLE.has(category) && rand() > 0.5
  return (
    <svg viewBox={VB} className={SVG} aria-hidden preserveAspectRatio={`xMidYMid ${fit}`}>
      <g transform={flip ? 'translate(640 0) scale(-1 1)' : undefined}>{draw(rand, hue)}</g>
    </svg>
  )
}

/** Picks a real image when the post has one, the generated motif otherwise. */
export function Cover({
  post,
  fit,
}: {
  post: { slug: string; category: string; cover?: { src: string; alt: string } }
  fit?: 'slice' | 'meet'
}) {
  if (post.cover) {
    return <img src={post.cover.src} alt={post.cover.alt} className="h-full w-full object-cover" />
  }
  return <PostCover slug={post.slug} category={post.category} fit={fit} />
}
