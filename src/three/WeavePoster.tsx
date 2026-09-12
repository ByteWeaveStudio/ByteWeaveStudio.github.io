import { useMemo } from 'react'
import {
  PLATE_D,
  PLATE_W,
  PLATE_Y,
  STAGES,
  THINK_EDGES,
  THINK_NODES,
  THINK_ROUTE,
} from './stages'

/**
 * Static isometric rendering of The Weave.
 *
 * Shown instead of the canvas on small screens, under reduced motion, and
 * wherever WebGL is unavailable or the device is weak — and as the instant
 * placeholder while the 3D chunk loads.
 *
 * It projects the *same* stage data as WeaveScene, so the two compositions
 * cannot drift apart. On mobile a crisp static drawing beats a throttled
 * canvas, so this is a real alternative rather than a degradation.
 */

const YAW = -0.42
const SIN = Math.sin(YAW)
const COS = Math.cos(YAW)
const SCALE = 100
const SQUASH = 0.62
const Y_GAIN = 1.2

/** Mirrors the ramp used by WeaveScene. */
const RAMP = ['#5170fe', '#7a6ff2', '#8e6cea', '#b06ade', '#d769d1', '#f568c7']
const CX = 300
const CY = 300

function project(x: number, y: number, z: number): [number, number] {
  const rx = x * COS + z * SIN
  const rz = -x * SIN + z * COS
  // Vertical gain is larger than the horizontal scale so adjacent plates stay
  // visually separated, matching the perspective camera's spacing.
  return [CX + rx * SCALE, CY - y * SCALE * Y_GAIN + rz * SCALE * SQUASH]
}

function quad(cx: number, y: number, cz: number, sx: number, sz: number) {
  const hx = sx / 2
  const hz = sz / 2
  return [
    project(cx - hx, y, cz - hz),
    project(cx + hx, y, cz - hz),
    project(cx + hx, y, cz + hz),
    project(cx - hx, y, cz + hz),
  ]
    .map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`)
    .join(' ')
}

export function WeavePoster({ className = '' }: { className?: string }) {
  // Mirrors WeaveScene: three braids of two counter-phased strands.
  // Mirrors WeaveScene: phase tied to plate spacing, so each pair of strands
  // meets exactly where it passes through a plate.
  // Mirrors WeaveScene: three braids of two counter-phased strands.
  // Mirrors WeaveScene: three ropes of four strands, anchored plate-to-plate.
  const threads = useMemo(() => {
    const centres = [-1.0, 0, 1.0]
    const STRANDS = 4
    const AMP = 0.16
    const TURNS = 1.5
    const bottom = PLATE_Y[0]
    const top = PLATE_Y[3]
    const out: { d: string; stroke: string }[] = []

    centres.forEach((cx, j) => {
      for (let k = 0; k < STRANDS; k++) {
        const phase = (k / STRANDS) * Math.PI * 2
        const pts: string[] = []
        for (let i = 0; i <= 80; i++) {
          const t = i / 80
          const a = t * Math.PI * 2 * TURNS + phase
          const [px, py] = project(
            cx + AMP * Math.sin(a),
            bottom + (top - bottom) * t,
            AMP * 0.6 * Math.cos(a),
          )
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
        }
        out.push({ d: pts.join(' '), stroke: RAMP[Math.min(RAMP.length - 1, j * 2 + (k % 2))] })
      }
    })
    return out
  }, [])

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-label="Diagram of the ByteWeave system: four layered planes showing data resolving from raw samples, to structured fields, to a reasoning graph, to an interface."
    >
      {/* threads behind */}
      {threads.map((t, i) => (
        <polyline
          key={`tb-${i}`}
          points={t.d}
          fill="none"
          stroke={t.stroke}
          strokeWidth={1.2}
          opacity={0.6}
        />
      ))}

      {PLATE_Y.map((y, plate) => (
        <g key={plate}>
          <polygon
            points={quad(0, y, 0, PLATE_W, PLATE_D)}
            fill="#ffffff"
            fillOpacity="0.62"
            stroke="#9a9a96"
            strokeOpacity="0.65"
            strokeWidth="1"
          />

          {plate === 2
            ? THINK_EDGES.map(([a, b], i) => {
                const [x1, y1] = project(THINK_NODES[a][0], y + 0.03, THINK_NODES[a][1])
                const [x2, y2] = project(THINK_NODES[b][0], y + 0.03, THINK_NODES[b][1])
                const lit = THINK_ROUTE.has(i)
                return (
                  <line
                    key={i}
                    x1={x1.toFixed(1)}
                    y1={y1.toFixed(1)}
                    x2={x2.toFixed(1)}
                    y2={y2.toFixed(1)}
                    stroke={lit ? '#1f48ff' : '#b8b8b4'}
                    strokeWidth={lit ? 1.5 : 1}
                  />
                )
              })
            : null}

          {STAGES[plate].map((m, i) => (
            <polygon
              key={i}
              points={quad(m.x, y + 0.03, m.z, m.sx, m.sz)}
              fill={m.accent ? '#1f48ff' : m.light ? '#c4c4c0' : '#54545c'}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
