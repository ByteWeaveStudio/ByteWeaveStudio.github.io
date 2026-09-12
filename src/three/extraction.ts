import { FIELD_BOXES, PAPER } from './invoice'

/**
 * Layout for the Positioning section's visual: a document on a desk, the
 * fields lifting off it, and an application receiving them.
 *
 * It is the same argument the copy makes — from a document on a desk to a
 * decision inside an application — drawn rather than illustrated. Geometry is
 * generated from this one file so the WebGL scene and the SVG poster cannot
 * drift apart.
 */

export const DOC = { w: 2.1, d: 2.8 }

export const DOC_POS: [number, number, number] = [-0.9, 0, 0]

/**
 * The page stands upright and is turned toward the JSON panel on the right,
 * rather than lying flat. Page coordinates stay as (x, z) with z running down
 * the page, so all the bar and field data below is unchanged; this transform
 * is the only thing that knows about the orientation.
 */
export const DOC_TILT = 0.45

/**
 * How far the page leans back from vertical. The foot of the page lifts and
 * comes toward the viewer, so it reads as propped rather than pinned flat.
 */
export const DOC_LEAN = 0.2

/** Map a point on the page to world space. `lift` is along the page normal. */
export function pageToWorld(x: number, z: number, lift = 0): [number, number, number] {
  // Stand the page up, less the lean: rotation about X by (PI/2 - DOC_LEAN).
  const cl = Math.cos(DOC_LEAN)
  const sl = Math.sin(DOC_LEAN)
  const ux = x
  const uy = lift * sl - z * cl
  const uz = lift * cl + z * sl
  // Turn to face the panel.
  const c = Math.cos(DOC_TILT)
  const sn = Math.sin(DOC_TILT)
  return [DOC_POS[0] + ux * c + uz * sn, DOC_POS[1] + uy, DOC_POS[2] - ux * sn + uz * c]
}

/**
 * Where each extracted value leaves the frame, heading for the JSON panel
 * beside the canvas. The values are rendered as real text in HTML, so the 3D
 * only has to carry them to the edge.
 */
export const EXIT_X = 2.4
export const exitY = (i: number) => 1.15 - i * 0.26

/** Paper pixels -> page units, so the field boxes land on the drawn values. */
export const paperToPage = (px: number, py: number): [number, number] => [
  (px / PAPER.w - 0.5) * DOC.w,
  (py / PAPER.h - 0.5) * DOC.d,
]

export type Field = {
  id: string
  label: string
  /** Region on the page this is read from, in page units. */
  src: { x: number; z: number; w: number; h: number }
  /** Below 0.8 the pipeline routes it to a human — same rule as the real one. */
  confidence: number
}

const FIELD_META: { id: string; label: string; confidence: number }[] = [
  { id: 'invoice-no', label: 'Invoice no.', confidence: 0.99 },
  { id: 'date', label: 'Date', confidence: 0.97 },
  { id: 'vendor', label: 'Vendor', confidence: 0.96 },
  { id: 'line-items', label: 'Line items', confidence: 0.94 },
  { id: 'total', label: 'Total due', confidence: 0.71 },
]

export const FIELDS: Field[] = FIELD_META.map(({ id, label, confidence }) => {
  const b = FIELD_BOXES[id]
  const [x, z] = paperToPage(b.x + b.w / 2, b.y + b.h / 2)
  return {
    id,
    label,
    confidence,
    src: { x, z, w: (b.w / PAPER.w) * DOC.w, h: (b.h / PAPER.h) * DOC.d },
  }
})

export type JsonLine = {
  indent: number
  key?: string
  value?: string
  /** 'string' | 'number' | 'open' | 'close' — drives the syntax colour. */
  kind: 'string' | 'number' | 'open' | 'close'
  /** Links the line to a region on the page, for the hover interaction. */
  fieldId?: string
  /** Low-confidence values are the ones a person reviews. */
  flagged?: boolean
}

export const JSON_LINES: JsonLine[] = [
  { indent: 0, kind: 'open', value: '{' },
  { indent: 1, key: 'invoice_no', value: '"INV-2043"', kind: 'string', fieldId: 'invoice-no' },
  { indent: 1, key: 'date', value: '"2026-03-14"', kind: 'string', fieldId: 'date' },
  { indent: 1, key: 'vendor', value: '"Northwind Trading Co."', kind: 'string', fieldId: 'vendor' },
  { indent: 1, key: 'line_items', value: '[', kind: 'open', fieldId: 'line-items' },
  { indent: 2, kind: 'open', value: '{' },
  { indent: 3, key: 'description', value: '"Cable assembly"', kind: 'string', fieldId: 'line-items' },
  { indent: 3, key: 'qty', value: '4', kind: 'number', fieldId: 'line-items' },
  { indent: 3, key: 'amount', value: '18400.00', kind: 'number', fieldId: 'line-items' },
  { indent: 2, kind: 'close', value: '},' },
  { indent: 2, kind: 'close', value: '… 5 more' },
  { indent: 1, kind: 'close', value: '],' },
  { indent: 1, key: 'total_due', value: '64820.00', kind: 'number', fieldId: 'total', flagged: true },
  { indent: 1, key: 'currency', value: '"INR"', kind: 'string' },
  { indent: 0, kind: 'close', value: '}' },
]

/** How high the arc bows between the page and the panel. */
export const ARC_LIFT = 0.75
