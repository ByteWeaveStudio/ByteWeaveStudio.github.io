/**
 * Four small diagrams, one per capability. Each animates once on row hover
 * via CSS only — so the global prefers-reduced-motion override in base.css
 * pins them to their end state without any JS branching.
 *
 * They are drawn, not illustrated: the brief rules out decorative imagery,
 * and a precise diagram is the honest way to show a pipeline we can't
 * screenshot yet.
 */

const T = 'transition-all duration-[600ms] ease-[var(--ease-out)]'
const frame = 'text-line-strong'

function See() {
  return (
    <svg viewBox="0 0 160 100" fill="none" aria-hidden className="h-full w-full">
      {/* pixel field */}
      <g className="text-ink-tertiary">
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 13 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={12 + c * 11} cy={14 + r * 10} r="1" fill="currentColor" />
          )),
        )}
      </g>
      {/* detections snap on */}
      <g className="text-accent" strokeWidth="1.25" stroke="currentColor">
        {[
          { x: 20, y: 22, w: 42, h: 34, d: '0ms' },
          { x: 76, y: 40, w: 30, h: 28, d: '90ms' },
          { x: 112, y: 18, w: 26, h: 22, d: '180ms' },
        ].map((b) => (
          <g
            key={b.d}
            className={`${T} origin-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100`}
            style={{ transitionDelay: b.d, transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }}
          >
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" />
            <path d={`M${b.x} ${b.y + 6}V${b.y}h6`} strokeWidth="2" />
            <path d={`M${b.x + b.w} ${b.y + b.h - 6}V${b.y + b.h}h-6`} strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  )
}

function Understand() {
  const raw = [46, 62, 38, 54, 30]
  return (
    <svg viewBox="0 0 160 100" fill="none" aria-hidden className="h-full w-full">
      <rect x="10" y="10" width="140" height="80" rx="3" className={frame} stroke="currentColor" />
      {raw.map((w, i) => (
        <g key={i}>
          {/* unstructured line, fades out */}
          <rect
            x="22"
            y={24 + i * 12}
            width={w}
            height="3"
            rx="1.5"
            className={`fill-line-strong ${T} group-hover:opacity-0`}
            style={{ transitionDelay: `${i * 45}ms` }}
          />
          {/* resolves into a labelled field */}
          <g
            className={`${T} translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
            style={{ transitionDelay: `${i * 45 + 120}ms` }}
          >
            <rect x="22" y={24 + i * 12} width="26" height="3" rx="1.5" className="fill-ink-tertiary" />
            <rect x="54" y={24 + i * 12} width={w * 0.7} height="3" rx="1.5" className="fill-accent" />
          </g>
        </g>
      ))}
    </svg>
  )
}

function Think() {
  const nodes = [
    { x: 24, y: 50 },
    { x: 62, y: 26 },
    { x: 62, y: 74 },
    { x: 100, y: 50 },
    { x: 136, y: 30 },
    { x: 136, y: 70 },
  ]
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
  ]
  // The illuminated route: 0 → 1 → 3 → 4
  const lit = new Set([0, 2, 4])
  return (
    <svg viewBox="0 0 160 100" fill="none" aria-hidden className="h-full w-full">
      {edges.map(([a, b], i) => {
        const p = `M${nodes[a].x} ${nodes[a].y}L${nodes[b].x} ${nodes[b].y}`
        return (
          <g key={i}>
            <path d={p} className="stroke-line-strong" strokeWidth="1" />
            {lit.has(i) ? (
              <path
                d={p}
                className={`stroke-accent ${T}`}
                strokeWidth="1.5"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
                style={{ transitionDelay: `${[...lit].indexOf(i) * 140}ms` }}
              />
            ) : null}
          </g>
        )
      })}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="3.5"
          className={`fill-raised stroke-line-strong ${T} ${
            [0, 1, 3, 4].includes(i) ? 'group-hover:stroke-accent' : ''
          }`}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

function Act() {
  return (
    <svg viewBox="0 0 160 100" fill="none" aria-hidden className="h-full w-full">
      <rect x="10" y="10" width="140" height="80" rx="3" className={frame} stroke="currentColor" />
      <path d="M10 26h140" className={frame} stroke="currentColor" />
      {[
        { x: 20, y: 34, w: 30, h: 46, d: '0ms' },
        { x: 58, y: 34, w: 40, h: 20, d: '80ms' },
        { x: 106, y: 34, w: 34, h: 20, d: '160ms' },
        { x: 58, y: 60, w: 82, h: 20, d: '240ms' },
      ].map((c) => (
        <rect
          key={c.d}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          rx="2"
          className={`fill-line ${T} translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
          style={{ transitionDelay: c.d }}
        />
      ))}
      <circle cx="20" cy="18" r="2" className="fill-accent" />
      <rect x="28" y="16.5" width="24" height="3" rx="1.5" className="fill-line-strong" />
    </svg>
  )
}

const MAP = { see: See, understand: Understand, think: Think, act: Act } as const

export function CapabilityVisual({ id }: { id: string }) {
  const Cmp = MAP[id as keyof typeof MAP]
  return Cmp ? <Cmp /> : null
}
