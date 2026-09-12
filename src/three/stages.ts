/**
 * Layouts for the four plates of The Weave.
 *
 * The metaphor is the ByteWeave mark itself — two interlaced ribbons — read as
 * "raw data is woven into working software". Each plate holds the same
 * information in a more resolved representation than the one below it:
 *
 *   0  SEE         scattered samples settling into an ordered pixel field
 *   1  UNDERSTAND  that field collapsing into labelled key/value rows
 *   2  THINK       rows lifting into a graph, with one route illuminated
 *   3  ACT         the graph resolving into interface panels
 *
 * Everything is generated, not authored, so the geometry stays tiny.
 */

export type Mark = {
  /** target position in plate-local space */
  x: number
  z: number
  /** footprint */
  sx: number
  sz: number
  accent: boolean
  /** Large surfaces (the ACT panels) read as a black mass at ink weight. */
  light?: boolean
  /** unresolved position — where the mark sits before its plate activates */
  fx: number
  fz: number
}

export const PLATE_W = 3
export const PLATE_D = 1.9
export const PLATE_Y = [-1.78, -0.59, 0.59, 1.78]

/** Deterministic PRNG so the composition is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function scatter(r: () => number) {
  return {
    fx: (r() - 0.5) * PLATE_W * 1.25,
    fz: (r() - 0.5) * PLATE_D * 1.25,
  }
}

/** 0 · SEE — a pixel field with detections framed as bounding boxes. */
function see(): Mark[] {
  const r = rng(11)
  const cols = 15
  const rows = 9
  const marks: Mark[] = []

  // Only the perimeter of a region is accented, so a detection reads as a
  // box drawn around something rather than as a blob of colour. Two regions,
  // not three — accent is the scarcest thing in the palette.
  const regions = [
    { x0: 2, x1: 6, z0: 1, z1: 4 },
    { x0: 9, x1: 12, z0: 4, z1: 7 },
  ]

  for (let c = 0; c < cols; c++) {
    for (let z = 0; z < rows; z++) {
      const region = regions.find((g) => c >= g.x0 && c <= g.x1 && z >= g.z0 && z <= g.z1)
      const onEdge =
        region !== undefined &&
        (c === region.x0 || c === region.x1 || z === region.z0 || z === region.z1)

      marks.push({
        x: (c / (cols - 1) - 0.5) * (PLATE_W - 0.4),
        z: (z / (rows - 1) - 0.5) * (PLATE_D - 0.3),
        sx: onEdge ? 0.07 : region ? 0.055 : 0.042,
        sz: onEdge ? 0.07 : region ? 0.055 : 0.042,
        accent: onEdge,
        ...scatter(r),
      })
    }
  }
  return marks
}

/** 1 · UNDERSTAND — key/value rows, one field low-confidence. */
function understand(): Mark[] {
  const r = rng(29)
  const rows = 8
  const marks: Mark[] = []

  const KEY_X0 = -1.36
  const KEY_W = 0.5
  const VAL_X0 = -0.74
  const VAL_X1 = 1.36
  const GAP = 0.07

  for (let i = 0; i < rows; i++) {
    const z = (i / (rows - 1) - 0.5) * (PLATE_D - 0.35)
    marks.push({
      x: KEY_X0 + KEY_W / 2,
      z,
      sx: KEY_W,
      sz: 0.05,
      accent: false,
      ...scatter(r),
    })

    // Value cells share a fixed track, so a row can never leave the plate.
    const cells = 2 + (i % 3)
    const track = VAL_X1 - VAL_X0 - GAP * (cells - 1)
    const weights = Array.from({ length: cells }, () => 0.6 + r() * 0.8)
    const total = weights.reduce((a, b) => a + b, 0)
    let cursor = VAL_X0
    weights.forEach((w, c) => {
      const width = (w / total) * track
      marks.push({
        x: cursor + width / 2,
        z,
        sx: width,
        sz: 0.05,
        accent: i === 5 && c === cells - 1,
        ...scatter(r),
      })
      cursor += width + GAP
    })
  }
  return marks
}

export const THINK_NODES: [number, number][] = [
  [-1.15, 0],
  [-0.45, -0.55],
  [-0.45, 0.55],
  [0.25, -0.62],
  [0.25, 0],
  [0.25, 0.62],
  [0.95, -0.35],
  [0.95, 0.35],
  [1.32, 0],
]

/** The illuminated route: 0 → 2 → 5 → 7 → 8 */
export const THINK_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 7],
  [6, 8],
  [7, 8],
]
export const THINK_ROUTE = new Set([1, 5, 9, 11])

/** 2 · THINK — graph nodes (edges are drawn as lines, not instances). */
function think(): Mark[] {
  const r = rng(47)
  const route = new Set([0, 2, 5, 7, 8])
  return THINK_NODES.map(([x, z], i) => ({
    x,
    z,
    sx: 0.13,
    sz: 0.13,
    accent: route.has(i),
    ...scatter(r),
  }))
}

/** 3 · ACT — interface panels. */
function act(): Mark[] {
  const r = rng(83)
  const panels: [number, number, number, number, boolean][] = [
    [-1.13, 0.06, 0.46, 1.42, false], // sidebar
    [0.19, -0.66, 1.94, 0.12, false], // header bar
    [-0.3, -0.18, 1.0, 0.48, false], // primary card
    [0.85, -0.18, 0.7, 0.48, true], // accent card
    [-0.3, 0.45, 0.6, 0.4, false],
    [0.42, 0.45, 0.46, 0.4, false],
    [1.03, 0.45, 0.34, 0.4, false],
  ]
  return panels.map(([x, z, sx, sz, accent]) => ({
    x,
    z,
    sx,
    sz,
    accent,
    light: !accent,
    ...scatter(r),
  }))
}

export const STAGES = [see(), understand(), think(), act()]
export const STAGE_OFFSETS = STAGES.reduce<number[]>(
  (acc, s) => [...acc, (acc.at(-1) ?? 0) + s.length],
  [0],
)
export const TOTAL_MARKS = STAGE_OFFSETS.at(-1)!
