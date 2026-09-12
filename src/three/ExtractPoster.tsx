import { useMemo } from 'react'
import { FIELD_BOXES, FONT_STACK, INVOICE_ELEMENTS, PAPER } from './invoice'
import { ARC_LIFT, EXIT_X, FIELDS, exitY, pageToWorld, paperToPage } from './extraction'

/**
 * Static rendering of the extraction visual.
 *
 * Shown on small screens, under reduced motion, and wherever WebGL is
 * unavailable — and as the instant placeholder while the scene chunk loads.
 *
 * The page is a planar quad under a linear projection, so mapping paper
 * coordinates onto it is a plain affine transform. That lets the invoice be
 * rendered as real SVG text from the same element list the canvas texture
 * uses: legible, selectable, and impossible to drift out of sync.
 */

// Matches the scene camera: near head-on, a little to the right and above.
const YAW = 0.16
const PITCH = 0.19
const SCALE = 108
const CX = 300
const CY = 210

function project(x: number, y: number, z: number): [number, number] {
  const x1 = x * Math.cos(YAW) + z * Math.sin(YAW)
  const z1 = -x * Math.sin(YAW) + z * Math.cos(YAW)
  return [CX + x1 * SCALE, CY - y * SCALE * Math.cos(PITCH) + z1 * SCALE * Math.sin(PITCH)]
}

/** Project a point given in paper pixels. */
const paperPoint = (px: number, py: number, lift = 0): [number, number] => {
  const [x, z] = paperToPage(px, py)
  return project(...pageToWorld(x, z, lift))
}

export function ExtractPoster({ className = '' }: { className?: string }) {
  const { matrix, arcs } = useMemo(() => {
    const o = paperPoint(0, 0)
    const px = paperPoint(PAPER.w, 0)
    const py = paperPoint(0, PAPER.h)
    const ex = [(px[0] - o[0]) / PAPER.w, (px[1] - o[1]) / PAPER.w]
    const ey = [(py[0] - o[0]) / PAPER.h, (py[1] - o[1]) / PAPER.h]
    const matrix = `matrix(${ex[0].toFixed(4)} ${ex[1].toFixed(4)} ${ey[0].toFixed(4)} ${ey[1].toFixed(4)} ${o[0].toFixed(2)} ${o[1].toFixed(2)})`

    const arcs = FIELDS.map((f, i) => {
      const a = pageToWorld(f.src.x, f.src.z, 0.03)
      const b: [number, number, number] = [EXIT_X, exitY(i), 0]
      const mid: [number, number, number] = [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2 + ARC_LIFT,
        (a[2] + b[2]) / 2,
      ]
      const [x1, y1] = project(...a)
      const [cx, cy] = project(...mid)
      const [x2, y2] = project(...b)
      return {
        d: `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        low: f.confidence < 0.8,
      }
    })

    return { matrix, arcs }
  }, [])

  return (
    <svg
      viewBox="60 -20 620 420"
      className={className}
      role="img"
      aria-label="Diagram: an invoice with its vendor, number, date, line items and total marked as detected fields, each lifting off the page as structured data."
    >
      {arcs.map((a, i) => (
        <path
          key={i}
          d={a.d}
          fill="none"
          stroke={a.low ? '#1f48ff' : '#c4c4c0'}
          strokeWidth="1"
          opacity={a.low ? 0.6 : 0.45}
        />
      ))}

      <g transform={matrix}>
        <rect
          x="0"
          y="0"
          width={PAPER.w}
          height={PAPER.h}
          fill="#ffffff"
          stroke="#9a9a96"
          strokeOpacity="0.7"
          strokeWidth="1.2"
        />

        <g fontFamily={FONT_STACK}>
          {INVOICE_ELEMENTS.map((el, i) =>
            el.kind === 'rule' ? (
              <line
                key={i}
                x1={el.x1}
                y1={el.y}
                x2={el.x2}
                y2={el.y}
                stroke="#d8d8d4"
                strokeWidth="1"
              />
            ) : (
              <text
                key={i}
                x={el.x}
                y={el.y}
                fill={el.color}
                fontSize={el.size}
                fontWeight={el.weight}
                textAnchor={el.align === 'right' ? 'end' : 'start'}
              >
                {el.text}
              </text>
            ),
          )}
        </g>

        {FIELDS.map((f) => {
          const b = FIELD_BOXES[f.id]
          const low = f.confidence < 0.8
          return (
            <rect
              key={f.id}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="2"
              fill={low ? '#1f48ff' : '#54545c'}
              fillOpacity={low ? 0.1 : 0.05}
              stroke={low ? '#1f48ff' : '#54545c'}
              strokeWidth={low ? 1.6 : 1.1}
              strokeOpacity={low ? 1 : 0.75}
            />
          )
        })}
      </g>
    </svg>
  )
}
