/**
 * The invoice on the page.
 *
 * One layout definition, in "paper pixels", drives three things: the canvas
 * texture mapped onto the 3D sheet, the SVG fallback, and the field regions
 * the extraction highlights. Defining it once is what keeps the boxes sitting
 * exactly on the values they claim to have read.
 *
 * The data is illustrative sample data, not a real client's invoice. The
 * arithmetic is real, though — the line items sum to the subtotal, and
 * subtotal plus GST equals the total the JSON reports.
 */

export const PAPER = { w: 420, h: 560 } // aspect matches DOC (2.1 x 2.8)

export const INVOICE = {
  vendor: 'Northwind Trading Co.',
  vendorLines: ['Plot 14, Industrial Estate', 'Pune 411019 · GSTIN 27AABCU9603R1ZX'],
  number: 'INV-2043',
  date: '2026-03-14',
  billTo: 'Acme Manufacturing Pvt Ltd',
  items: [
    { desc: 'Cable assembly', qty: '4', amount: '18,400.00' },
    { desc: 'Mounting bracket, steel', qty: '12', amount: '7,320.00' },
    { desc: 'Sensor module SM-40', qty: '6', amount: '21,600.00' },
    { desc: 'Cable gland set', qty: '30', amount: '3,150.00' },
    { desc: 'Terminal block', qty: '18', amount: '2,462.20' },
    { desc: 'Freight & handling', qty: '1', amount: '2,000.00' },
  ],
  subtotal: '54,932.20',
  tax: '9,887.80',
  total: '64,820.00',
  footer: 'Payment due within 30 days · HDFC ****4021',
} as const

/** Vertical rhythm of the table, shared by every renderer. */
export const ROW_Y0 = 196
export const ROW_STEP = 25

/** Field regions, in paper pixels. Keyed to the ids used by FIELDS/JSON. */
export const FIELD_BOXES: Record<string, { x: number; y: number; w: number; h: number }> = {
  'invoice-no': { x: 286, y: 44, w: 112, h: 22 },
  date: { x: 286, y: 66, w: 112, h: 18 },
  vendor: { x: 22, y: 28, w: 214, h: 22 },
  'line-items': { x: 22, y: 178, w: 376, h: 158 },
  total: { x: 244, y: 396, w: 154, h: 26 },
}

export type InvoiceEl =
  | {
      kind: 'text'
      x: number
      y: number
      text: string
      size: number
      weight: number
      color: string
      align: 'left' | 'right'
    }
  | { kind: 'rule'; x1: number; x2: number; y: number }

const INK = '#2b2b30'
const MUTED = '#8a8a90'
const RULE = '#d8d8d4'

const t = (
  x: number,
  y: number,
  text: string,
  size: number,
  weight = 400,
  color = INK,
  align: 'left' | 'right' = 'left',
): InvoiceEl => ({ kind: 'text', x, y, text, size, weight, color, align })

/**
 * The layout as data, so the canvas texture and the SVG fallback render from
 * exactly the same list rather than two hand-kept copies.
 */
export const INVOICE_ELEMENTS: InvoiceEl[] = [
  t(24, 44, INVOICE.vendor, 13.5, 600),
  ...INVOICE.vendorLines.map((line, i) => t(24, 60 + i * 12, line, 8.5, 400, MUTED)),

  t(396, 38, 'INVOICE', 19, 600, INK, 'right'),
  t(396, 60, INVOICE.number, 11.5, 500, INK, 'right'),
  t(396, 78, INVOICE.date, 9.5, 400, MUTED, 'right'),

  { kind: 'rule', x1: 24, x2: 396, y: 96 },

  t(24, 118, 'BILL TO', 7.5, 500, MUTED),
  t(24, 134, INVOICE.billTo, 10.5),

  t(24, 172, 'DESCRIPTION', 7.5, 500, MUTED),
  t(300, 172, 'QTY', 7.5, 500, MUTED, 'right'),
  t(396, 172, 'AMOUNT', 7.5, 500, MUTED, 'right'),
  { kind: 'rule', x1: 24, x2: 396, y: 180 },

  ...INVOICE.items.flatMap((item, i) => {
    const y = ROW_Y0 + i * ROW_STEP
    return [
      t(24, y, item.desc, 9.5),
      t(300, y, item.qty, 9.5, 400, MUTED, 'right'),
      t(396, y, item.amount, 9.5, 400, INK, 'right'),
    ]
  }),

  { kind: 'rule', x1: 244, x2: 396, y: 356 },
  t(330, 376, 'Subtotal', 9, 400, MUTED, 'right'),
  t(396, 376, INVOICE.subtotal, 9.5, 400, INK, 'right'),
  t(330, 392, 'GST 18%', 9, 400, MUTED, 'right'),
  t(396, 392, INVOICE.tax, 9.5, 400, INK, 'right'),
  t(330, 416, 'Total due', 12, 600, INK, 'right'),
  t(396, 416, `₹${INVOICE.total}`, 12, 600, INK, 'right'),

  { kind: 'rule', x1: 24, x2: 396, y: 440 },
  t(24, 458, INVOICE.footer, 8, 400, MUTED),
]

export const FONT_STACK = '"Geist", ui-sans-serif, system-ui, -apple-system, sans-serif'

/** Draws the invoice at 1:1 paper scale. The caller sets the canvas transform. */
export function drawInvoice(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, PAPER.w, PAPER.h)
  ctx.textBaseline = 'alphabetic'

  for (const el of INVOICE_ELEMENTS) {
    if (el.kind === 'rule') {
      ctx.strokeStyle = RULE
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(el.x1, el.y)
      ctx.lineTo(el.x2, el.y)
      ctx.stroke()
      continue
    }
    ctx.fillStyle = el.color
    ctx.font = `${el.weight} ${el.size}px ${FONT_STACK}`
    ctx.textAlign = el.align
    ctx.fillText(el.text, el.x, el.y)
  }
  ctx.textAlign = 'left'
}
