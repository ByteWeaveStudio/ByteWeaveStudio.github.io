import { useInView } from '@/hooks/useInView'
import { JSON_LINES } from './extraction'

/**
 * The extraction output, as real text rather than geometry.
 *
 * Rendering the JSON in HTML instead of inside the canvas keeps it crisp at
 * any pixel ratio, selectable, and present in the prerendered markup — and it
 * is the half of the story that has to be legible. The page it came from stays
 * in 3D next to it.
 *
 * Hovering a line highlights the region of the invoice the value was read
 * from; the state lives in the parent so the canvas can respond too.
 *
 * The block fades in as one — it is the finished output, not a replay of the
 * extraction, so there is nothing to reveal line by line.
 */
export function JsonPanel({
  activeField,
  onHoverField,
}: {
  activeField: string | null
  onHoverField: (id: string | null) => void
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const tone = (kind: string) =>
    kind === 'string'
      ? 'text-[#E8E8E4]'
      : kind === 'number'
        ? 'text-[#D769D1]'
        : 'text-dark-ink-secondary'

  return (
    <div
      ref={ref}
      className="border-dark-line bg-dark rounded-panel flex h-full flex-col overflow-hidden border"
    >
      <div className="border-dark-line flex items-center gap-2 border-b px-5 py-3">
        <span aria-hidden className="bg-accent-on-dark size-1.5 rounded-full" />
        <span className="text-dark-ink-secondary text-caption font-mono">extracted.json</span>
      </div>

      <pre className="text-dark-ink flex-1 overflow-x-auto px-2 py-4 font-mono text-[0.72rem] leading-[1.65] sm:text-[0.8rem]">
        <code>
          {JSON_LINES.map((line, i) => {
            const on = line.fieldId != null && line.fieldId === activeField
            return (
              <span
                key={i}
                onMouseEnter={() => line.fieldId && onHoverField(line.fieldId)}
                onMouseLeave={() => onHoverField(null)}
                className={[
                  'block rounded-sm border-l-2 px-3 transition-[opacity,transform,background-color,border-color] duration-500 ease-[var(--ease-out)]',
                  on ? 'border-accent-on-dark bg-white/6' : 'border-transparent',
                  line.fieldId ? 'cursor-default' : '',
                  inView ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              >
                <span style={{ paddingLeft: `${line.indent * 1.15}rem` }} />
                {line.key ? (
                  <>
                    <span className="text-[#7593FF]">&quot;{line.key}&quot;</span>
                    <span className="text-dark-ink-secondary">: </span>
                  </>
                ) : null}
                <span className={tone(line.kind)}>{line.value}</span>
                {line.key && line.kind !== 'open' ? (
                  <span className="text-dark-ink-secondary">,</span>
                ) : null}
                {line.flagged ? (
                  <span className="text-accent-on-dark">
                    {'  '}
                    {'//'} confidence 0.71 → review
                  </span>
                ) : null}
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
