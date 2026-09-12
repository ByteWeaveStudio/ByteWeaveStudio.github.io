import { useId } from 'react'

/**
 * Drawn diagrams, one per case study.
 *
 * These stand in for product screenshots, which do not exist yet — every
 * "case study" image on the old site was an AI illustration or a stock mockup.
 * A precise diagram is the honest substitute: it shows we understand the
 * system. It is replaced the moment real (redacted) UI is available.
 *
 * Each study borrows the geometry of its own domain instead of a shared
 * box-and-wire grammar, so the three separate at a glance: a document under
 * field overlays, a shop floor seen from above, a marked script beside its
 * cohort. Colour walks the logo ramp (blue → violet → pink) as a wash, with
 * exactly one saturated moment per diagram — always the point where a person
 * has to step in.
 */

type Hue = { line: string; solid: string; wash: string }

/** Sampled from --color-grad-from / --color-grad-via / --color-grad-to. */
const HUES: Record<string, Hue> = {
  extraction: { line: '#5170fe', solid: '#1f48ff', wash: '#eef2ff' },
  monitoring: { line: '#8e6cea', solid: '#6f43dc', wash: '#f4f0fd' },
  grading: { line: '#f568c7', solid: '#d33f9b', wash: '#fdf0f8' },
}

const VB = '0 0 640 380'
const SVG = 'h-full w-full'

const LABEL = 'fill-ink text-[12px] font-medium'
const SUB = 'fill-ink-secondary text-[11px]'
/* The index list and the homepage teaser render this at 310–415px wide, where
   12px type lands under 8px and reads as noise. Those containers get the
   `compact` cut instead: the signature shape only, at a size that survives. */
const LABEL_C = 'fill-ink text-[18px] font-medium'
const SUB_C = 'fill-ink-secondary text-[15px]'
const SHEET = 'fill-raised stroke-line-strong'
const HAIR = 'stroke-line'

/** Grey placeholder for a run of text inside a drawn document. */
function TextBar({ x, y, w, h = 5 }: { x: number; y: number; w: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fill-line" />
}

/** Camera field of view: rays and an arc, not a filled wedge. */
function Cone({
  at,
  a,
  b,
  bow,
  color,
}: {
  at: [number, number]
  a: [number, number]
  b: [number, number]
  bow: [number, number]
  color: string
}) {
  const arc = `M${a[0]} ${a[1]} Q${bow[0]} ${bow[1]} ${b[0]} ${b[1]}`
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <path d={`${arc} L${at[0]} ${at[1]} Z`} fill={color} opacity="0.06" stroke="none" />
      <path d={`M${a[0]} ${a[1]} L${at[0]} ${at[1]} L${b[0]} ${b[1]}`} strokeWidth="1" opacity="0.5" />
      <path d={arc} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
    </g>
  )
}

/** Drawn check, never a unicode glyph. */
function Check({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <path
      d={`M${x} ${y} l${3.5 * s} ${4 * s} l${7.5 * s} ${-9 * s}`}
      stroke={color}
      strokeWidth={1.6 * s}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  )
}

/* ── 1 · Extraction ─────────────────────────────────────────────
   A page under field overlays, each region tied by a hairline to its
   confidence on the rail. One field falls under the threshold and
   branches to a person. */

function Extraction({ arrow }: { arrow: string }) {
  const h = HUES.extraction
  const fields = [
    { label: 'Invoice no.', conf: 0.98, box: { x: 66, y: 92, w: 92, h: 20 } },
    { label: 'Invoice date', conf: 0.96, box: { x: 166, y: 92, w: 64, h: 20 } },
    { label: 'Line total', conf: 0.99, box: { x: 168, y: 214, w: 62, h: 20 } },
    { label: 'Vendor GSTIN', conf: 0.62, box: { x: 66, y: 262, w: 104, h: 20 } },
  ]
  const railX = 322
  const railW = 104
  const rowY = (i: number) => 96 + i * 46
  const threshold = railX + railW * 0.8

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      <Arrowhead id={arrow} />

      {/* the page */}
      <rect x="48" y="44" width="200" height="272" rx="6" className={SHEET} strokeWidth="1" />
      <text x="66" y="74" className={SUB} letterSpacing="0.08em">
        INVOICE
      </text>
      <path d="M66 82H230" className={HAIR} strokeWidth="1" />

      {/* body text */}
      <TextBar x={66} y={124} w={78} />
      <TextBar x={66} y={136} w={54} />
      <path d="M66 156H230" className={HAIR} strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <TextBar x={66} y={170 + i * 16} w={i === 1 ? 96 : 84} />
          <TextBar x={196} y={170 + i * 16} w={34} />
        </g>
      ))}
      <path d="M66 204H230" className={HAIR} strokeWidth="1" />
      <TextBar x={66} y={220} w={46} />
      <TextBar x={66} y={250} w={62} />

      {/* field overlays */}
      {fields.map((f) => {
        const low = f.conf < 0.8
        return (
          <rect
            key={f.label}
            x={f.box.x}
            y={f.box.y}
            width={f.box.w}
            height={f.box.h}
            rx="3"
            fill={h.wash}
            stroke={low ? h.solid : h.line}
            strokeWidth={low ? 1.5 : 1}
            strokeDasharray={low ? '3 2' : undefined}
          />
        )
      })}

      {/* page → rail */}
      {fields.map((f, i) => {
        const sx = f.box.x + f.box.w
        const sy = f.box.y + f.box.h / 2
        const ry = rowY(i)
        return (
          <path
            key={f.label}
            d={`M${sx} ${sy} C${sx + 46} ${sy}, ${railX - 66} ${ry}, ${railX - 8} ${ry}`}
            stroke={h.line}
            strokeWidth="1"
            fill="none"
            opacity="0.55"
          />
        )
      })}

      {/* confidence rail */}
      <text x={railX} y="64" className={SUB}>
        Confidence
      </text>
      <path
        d={`M${threshold} 72V${rowY(3) + 18}`}
        stroke={h.line}
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />
      {fields.map((f, i) => {
        const y = rowY(i)
        const low = f.conf < 0.8
        return (
          <g key={f.label}>
            <text x={railX} y={y - 10} className={LABEL}>
              {f.label}
            </text>
            <rect x={railX} y={y} width={railW} height="6" rx="3" className="fill-line" />
            <rect
              x={railX}
              y={y}
              width={railW * f.conf}
              height="6"
              rx="3"
              fill={low ? h.solid : h.line}
            />
            <text x={railX + railW + 12} y={y + 7} className={SUB}>
              {f.conf.toFixed(2)}
            </text>
          </g>
        )
      })}

      {/* branch */}
      <path
        d={`M470 ${rowY(0)}H478M470 ${rowY(1)}H478M470 ${rowY(2)}H478M478 ${rowY(0)}V${rowY(2)}`}
        className="stroke-line-strong"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M478 127H488"
        className="stroke-line-strong"
        strokeWidth="1"
        fill="none"
        markerEnd={`url(#${arrow})`}
      />
      <path
        d={`M470 ${rowY(3)}H482V251H488`}
        stroke={h.solid}
        strokeWidth="1"
        fill="none"
        markerEnd={`url(#${arrow})`}
      />

      <rect x="496" y="105" width="120" height="46" rx="5" className={SHEET} strokeWidth="1" />
      <text x="508" y="126" className={LABEL}>
        Reconciliation
      </text>
      <text x="508" y="141" className={SUB}>
        straight through
      </text>

      <rect
        x="496"
        y="228"
        width="120"
        height="46"
        rx="5"
        fill={h.wash}
        stroke={h.solid}
        strokeWidth="1"
      />
      <text x="508" y="249" className={LABEL}>
        Human review
      </text>
      <text x="508" y="264" className={SUB}>
        one field, not the page
      </text>

      <text x="48" y="340" className={SUB}>
        Invoice · bank statement · utility bill
      </text>
    </svg>
  )
}

/* ── 2 · Monitoring ─────────────────────────────────────────────
   The shop floor from above. Cameras throw cones across operator-drawn
   zones; a dotted trail is one shopper's path from door to counter. */

function Monitoring({ arrow }: { arrow: string }) {
  const h = HUES.monitoring
  const zones = [
    { x: 74, y: 96, w: 196, h: 138, label: 'Aisle' },
    { x: 280, y: 76, w: 78, h: 62, label: 'Counter' },
    { x: 150, y: 246, w: 120, h: 48, label: 'Entrance' },
  ]

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      <Arrowhead id={arrow} />

      {/* walls, with a gap for the door */}
      <path
        d="M48 52H364M364 52V300M364 300H252M190 300H48M48 300V52"
        className="stroke-line-strong"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="square"
      />

      {/* fixtures */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="84"
          y={112 + i * 48}
          width="172"
          height="9"
          rx="2"
          className="fill-line-strong"
        />
      ))}
      <rect x="288" y="110" width="62" height="10" rx="2" className="fill-line-strong" />

      {/* camera cones */}
      <Cone at={[62, 66]} a={[232, 138]} b={[166, 208]} bow={[214, 190]} color={h.line} />
      <Cone at={[350, 66]} a={[296, 132]} b={[342, 158]} bow={[318, 154]} color={h.line} />

      {/* operator-drawn zones, translucent so the plan reads underneath */}
      {zones.map((z) => (
        <g key={z.label}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx="4"
            fill={h.line}
            fillOpacity="0.12"
            stroke={h.line}
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text x={z.x + 8} y={z.y + 17} className="text-[11px] font-medium" fill={h.solid}>
            {z.label}
          </text>
        </g>
      ))}

      {/* footfall trail — enters right of the door, clear of the zone label */}
      <path
        d="M246 300 C246 274, 236 262, 216 236 S168 132, 300 112"
        stroke={h.line}
        strokeWidth="1.5"
        strokeDasharray="1 6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="246" cy="300" r="3" fill={h.line} />
      <circle cx="300" cy="112" r="3" fill={h.line} />

      {/* cameras */}
      {[
        { x: 62, y: 66 },
        { x: 350, y: 66 },
      ].map((c) => (
        <g key={c.x}>
          <rect
            x={c.x - 9}
            y={c.y - 7}
            width="18"
            height="13"
            rx="2.5"
            className="fill-raised"
            stroke={h.solid}
            strokeWidth="1.2"
          />
          <circle cx={c.x} cy={c.y - 0.5} r="2.6" fill={h.solid} />
        </g>
      ))}

      <text x="48" y="332" className={SUB}>
        Cameras already on site · zones drawn by the operator
      </text>

      {/* plan → live panel */}
      <path
        d="M364 176H392"
        className="stroke-line-strong"
        strokeWidth="1"
        fill="none"
        markerEnd={`url(#${arrow})`}
      />

      <text x="400" y="80" className={SUB}>
        Live
      </text>
      {[
        { label: 'Entrance', w: 138 },
        { label: 'Aisle', w: 92 },
        { label: 'Counter', w: 54 },
      ].map((r, i) => (
        <g key={r.label}>
          <text x="400" y={110 + i * 38} className={LABEL}>
            {r.label}
          </text>
          <rect x="400" y={118 + i * 38} width="180" height="6" rx="3" className="fill-line" />
          <rect x="400" y={118 + i * 38} width={r.w} height="6" rx="3" fill={h.line} />
        </g>
      ))}

      <rect
        x="400"
        y="230"
        width="216"
        height="56"
        rx="5"
        fill={h.wash}
        stroke={h.solid}
        strokeWidth="1"
      />
      <circle cx="416" cy="252" r="4" fill={h.solid} />
      <text x="428" y="256" className={LABEL}>
        Incident alert
      </text>
      <text x="412" y="274" className={SUB}>
        routed to the manager on shift
      </text>
    </svg>
  )
}

/* ── 3 · Grading ────────────────────────────────────────────────
   A marked script, the one answer the model was unsure of handed to a
   teacher, and what the cohort looks like once marks are data. */

function Grading({ arrow }: { arrow: string }) {
  const h = HUES.grading
  const rows = [
    { q: 'Q1', bar: 96, mark: '4 / 5', flagged: false },
    { q: 'Q2', bar: 72, mark: '5 / 5', flagged: false },
    { q: 'Q3', bar: 104, mark: '2 / 5', flagged: true },
    { q: 'Q4', bar: 84, mark: '4 / 5', flagged: false },
  ]
  const rowY = (i: number) => 104 + i * 44
  const bars = [8, 14, 24, 40, 58, 74, 84, 72, 52, 32, 18, 10]
  const peak = bars.indexOf(Math.max(...bars))
  const base = 286

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      <Arrowhead id={arrow} />

      {/* the stack, back to front */}
      <rect x="32" y="60" width="214" height="248" rx="6" className={SHEET} strokeWidth="1" />
      <rect x="40" y="52" width="214" height="248" rx="6" className={SHEET} strokeWidth="1" />
      <rect x="48" y="44" width="214" height="248" rx="6" className={SHEET} strokeWidth="1" />

      <text x="68" y="76" className={SUB} letterSpacing="0.08em">
        SUBMISSION
      </text>
      <path d="M68 84H242" className={HAIR} strokeWidth="1" />

      {rows.map((r, i) => {
        const y = rowY(i)
        return (
          <g key={r.q}>
            {r.flagged ? (
              <rect
                x="58"
                y={y - 17}
                width="200"
                height="32"
                rx="4"
                fill={h.wash}
                stroke={h.solid}
                strokeWidth="1"
                strokeDasharray="3 2"
              />
            ) : null}
            <text x="70" y={y + 3} className={SUB}>
              {r.q}
            </text>
            <TextBar x={94} y={y - 3} w={r.bar} />
            {r.flagged ? (
              <circle cx="210" cy={y - 1} r="4.5" fill="none" stroke={h.solid} strokeWidth="1.5" />
            ) : (
              <Check x={204} y={y - 2} color="#9a9a96" />
            )}
            <text
              x="222"
              y={y + 3}
              className={r.flagged ? 'text-[12px] font-medium' : LABEL}
              fill={r.flagged ? h.solid : undefined}
            >
              {r.mark}
            </text>
          </g>
        )
      })}

      {/* the unsure answer goes to a person */}
      <path
        d={`M262 ${rowY(2)} C280 ${rowY(2)}, 288 148, 306 124`}
        stroke={h.solid}
        strokeWidth="1"
        fill="none"
        markerEnd={`url(#${arrow})`}
      />

      <rect x="314" y="60" width="182" height="100" rx="5" className={SHEET} strokeWidth="1" />
      <text x="330" y="84" className={LABEL}>
        Teacher confirms
      </text>
      <text x="330" y="110" className={SUB}>
        model proposes
      </text>
      <text x="446" y="110" className={SUB}>
        2 / 5
      </text>
      <path d="M330 120H480" className={HAIR} strokeWidth="1" />
      <text x="330" y="141" className={LABEL}>
        teacher sets
      </text>
      <text x="446" y="141" className="text-[12px] font-medium" fill={h.solid}>
        3 / 5
      </text>

      {/* cohort, once marking is structured data */}
      <text x="314" y="190" className={LABEL}>
        Cohort spread
      </text>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={314 + i * 24}
          y={base - b}
          width="16"
          height={b}
          rx="2"
          fill={i === peak ? h.solid : h.line}
          opacity={i === peak ? 1 : 0.35}
        />
      ))}
      <path d={`M314 ${base}H602`} className="stroke-line-strong" strokeWidth="1" fill="none" />
      <text x="314" y="308" className={SUB}>
        every mark, once grading is data rather than a spreadsheet
      </text>
    </svg>
  )
}

/* ── Compact cuts ───────────────────────────────────────────────
   Same three subjects, stripped to the shape that identifies them and
   drawn large enough to read in a list card. The full diagrams explain;
   these only have to be unmistakably one another's opposite. */

function ExtractionCompact() {
  const h = HUES.extraction
  const fields = [
    { label: 'Invoice no.', conf: 0.98, box: { x: 80, y: 98, w: 116, h: 26 }, row: 120 },
    { label: 'Line total', conf: 0.99, box: { x: 196, y: 246, w: 92, h: 26 }, row: 210 },
    { label: 'Vendor GSTIN', conf: 0.62, box: { x: 80, y: 290, w: 132, h: 26 }, row: 298 },
  ]
  const railX = 352
  const railW = 176

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      <rect x="56" y="40" width="248" height="300" rx="8" className={SHEET} strokeWidth="1.2" />
      <text x="80" y="78" className={SUB_C} letterSpacing="0.08em">
        INVOICE
      </text>
      <path d="M80 88H288" className={HAIR} strokeWidth="1.2" />
      <TextBar x={80} y={142} w={104} h={7} />
      <TextBar x={80} y={160} w={72} h={7} />
      <path d="M80 182H288" className={HAIR} strokeWidth="1.2" />
      <TextBar x={80} y={196} w={112} h={7} />
      <TextBar x={80} y={216} w={98} h={7} />
      <path d="M80 238H288" className={HAIR} strokeWidth="1.2" />

      {fields.map((f) => {
        const low = f.conf < 0.8
        return (
          <rect
            key={f.label}
            x={f.box.x}
            y={f.box.y}
            width={f.box.w}
            height={f.box.h}
            rx="4"
            fill={h.wash}
            stroke={low ? h.solid : h.line}
            strokeWidth={low ? 2 : 1.4}
            strokeDasharray={low ? '4 3' : undefined}
          />
        )
      })}

      {fields.map((f) => {
        const sx = f.box.x + f.box.w
        const sy = f.box.y + f.box.h / 2
        return (
          <path
            key={f.label}
            d={`M${sx} ${sy} C${sx + 44} ${sy}, ${railX - 60} ${f.row}, ${railX - 8} ${f.row}`}
            stroke={h.line}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
        )
      })}

      {fields.map((f) => {
        const low = f.conf < 0.8
        return (
          <g key={f.label}>
            <text x={railX} y={f.row - 14} className={LABEL_C}>
              {f.label}
            </text>
            <rect x={railX} y={f.row} width={railW} height="10" rx="5" className="fill-line" />
            <rect
              x={railX}
              y={f.row}
              width={railW * f.conf}
              height="10"
              rx="5"
              fill={low ? h.solid : h.line}
            />
            <text x={railX + railW + 14} y={f.row + 10} className={SUB_C}>
              {f.conf.toFixed(2)}
            </text>
          </g>
        )
      })}

      <text x={railX} y="336" className="text-[15px] font-medium" fill={h.solid}>
        low confidence → a person
      </text>
    </svg>
  )
}

function MonitoringCompact() {
  const h = HUES.monitoring
  const zones = [
    { x: 112, y: 128, w: 246, h: 42, label: 'Aisle 2' },
    { x: 420, y: 92, w: 130, h: 96, label: 'Counter' },
    { x: 150, y: 262, w: 136, h: 62, label: 'Entrance' },
  ]

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      {/* walls, with a gap for the door */}
      <path
        d="M64 48H576M576 48V332M576 332H350M290 332H64M64 332V48"
        className="stroke-line-strong"
        strokeWidth="2"
        fill="none"
        strokeLinecap="square"
      />

      {/* shelf runs */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="120"
          y={112 + i * 60}
          width="230"
          height="14"
          rx="3"
          className="fill-line-strong"
        />
      ))}
      <rect x="432" y="166" width="106" height="14" rx="3" className="fill-line-strong" />

      <Cone at={[84, 66]} a={[244, 132]} b={[182, 200]} bow={[228, 180]} color={h.line} />
      <Cone at={[556, 66]} a={[472, 138]} b={[548, 164]} bow={[512, 160]} color={h.line} />

      {zones.map((z) => (
        <g key={z.label}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx="5"
            fill={h.line}
            fillOpacity="0.12"
            stroke={h.line}
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <text x={z.x + 12} y={z.y + 25} className="text-[15px] font-medium" fill={h.solid}>
            {z.label}
          </text>
        </g>
      ))}

      {/* footfall trail — door, up the aisle, to the counter */}
      <path
        d="M320 332 C320 300, 300 288, 268 244 S330 158, 466 140"
        stroke={h.line}
        strokeWidth="2"
        strokeDasharray="1 8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="320" cy="332" r="4" fill={h.line} />

      {[
        { x: 84, y: 66 },
        { x: 556, y: 66 },
      ].map((c) => (
        <g key={c.x}>
          <rect
            x={c.x - 13}
            y={c.y - 10}
            width="26"
            height="19"
            rx="3.5"
            className="fill-raised"
            stroke={h.solid}
            strokeWidth="1.6"
          />
          <circle cx={c.x} cy={c.y - 0.5} r="4" fill={h.solid} />
        </g>
      ))}

      {/* the one thing a manager is meant to see */}
      <circle cx="524" cy="122" r="15" fill="none" stroke={h.solid} strokeWidth="1.4" opacity="0.5" />
      <circle cx="524" cy="122" r="7" fill={h.solid} />
      <text x="524" y="154" className="text-[15px] font-medium" fill={h.solid} textAnchor="middle">
        Alert
      </text>
    </svg>
  )
}

function GradingCompact() {
  const h = HUES.grading
  const rows = [
    { q: 'Q1', bar: 92, mark: '4 / 5', flagged: false },
    { q: 'Q2', bar: 70, mark: '5 / 5', flagged: false },
    { q: 'Q3', bar: 100, mark: '2 / 5', flagged: true },
    { q: 'Q4', bar: 82, mark: '4 / 5', flagged: false },
  ]
  const rowY = (i: number) => 120 + i * 56
  const bars = [10, 18, 32, 52, 74, 92, 80, 58, 36, 20, 12]
  const peak = bars.indexOf(Math.max(...bars))
  const base = 300

  return (
    <svg viewBox={VB} className={SVG} aria-hidden>
      <rect x="40" y="60" width="252" height="288" rx="8" className={SHEET} strokeWidth="1.2" />
      <rect x="48" y="52" width="252" height="288" rx="8" className={SHEET} strokeWidth="1.2" />
      <rect x="56" y="44" width="252" height="288" rx="8" className={SHEET} strokeWidth="1.2" />

      <text x="80" y="82" className={SUB_C} letterSpacing="0.08em">
        SUBMISSION
      </text>
      <path d="M80 92H284" className={HAIR} strokeWidth="1.2" />

      {rows.map((r, i) => {
        const y = rowY(i)
        return (
          <g key={r.q}>
            {r.flagged ? (
              <rect
                x="68"
                y={y - 22}
                width="228"
                height="40"
                rx="5"
                fill={h.wash}
                stroke={h.solid}
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
            ) : null}
            <text x="82" y={y + 5} className={SUB_C}>
              {r.q}
            </text>
            <TextBar x={114} y={y - 4} w={r.bar} h={7} />
            {r.flagged ? (
              <circle cx="234" cy={y - 1} r="6.5" fill="none" stroke={h.solid} strokeWidth="2" />
            ) : (
              <Check x={228} y={y - 3} color="#9a9a96" s={1.4} />
            )}
            <text
              x="250"
              y={y + 5}
              className={r.flagged ? 'text-[18px] font-medium' : LABEL_C}
              fill={r.flagged ? h.solid : undefined}
            >
              {r.mark}
            </text>
          </g>
        )
      })}

      <text x="352" y="196" className={LABEL_C}>
        Cohort spread
      </text>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={352 + i * 24}
          y={base - b}
          width="18"
          height={b}
          rx="2.5"
          fill={i === peak ? h.solid : h.line}
          opacity={i === peak ? 1 : 0.35}
        />
      ))}
      <path d={`M352 ${base}H610`} className="stroke-line-strong" strokeWidth="1.2" fill="none" />
      <text x="352" y="328" className={SUB_C}>
        every mark, once it is data
      </text>
    </svg>
  )
}

function Arrowhead({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M1 1.5 6 4 1 6.5" className="stroke-line-strong" strokeWidth="1" fill="none" />
      </marker>
    </defs>
  )
}

const FULL = { extraction: Extraction, monitoring: Monitoring, grading: Grading } as const
const COMPACT = {
  extraction: ExtractionCompact,
  monitoring: MonitoringCompact,
  grading: GradingCompact,
} as const

export function Schematic({ id, compact = false }: { id: string; compact?: boolean }) {
  // Each instance needs its own marker id — the same diagram renders on the
  // index, the detail page and the homepage teaser.
  const arrow = `bw-arrow-${useId().replace(/:/g, '')}`
  if (compact) {
    const Small = COMPACT[id as keyof typeof COMPACT]
    return Small ? <Small /> : null
  }
  const Cmp = FULL[id as keyof typeof FULL]
  return Cmp ? <Cmp arrow={arrow} /> : null
}
