import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function format(value: number, decimals: number) {
  return value.toFixed(decimals)
}

/**
 * Count-up figure.
 *
 * The final value is always what React renders, so it is present in the
 * prerendered HTML (these numbers are the page's core credibility claim and
 * must be crawlable) and there is no hydration mismatch. The animation is
 * applied imperatively to textContent afterwards, and is skipped entirely
 * under reduced motion.
 */
export function Metric({
  value,
  decimals = 0,
  suffix = '',
  label,
  className = '',
}: {
  value: number
  decimals?: number
  suffix?: string
  label: string
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const numRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = numRef.current
    if (!el || !inView || reduced) return

    const DURATION = 900
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      // matches --ease-out
      const eased = 1 - Math.pow(1 - t, 4)
      el.textContent = format(value * eased, decimals)
      if (t < 1) frame = requestAnimationFrame(tick)
      else el.textContent = format(value, decimals)
    }

    el.textContent = format(0, decimals)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      el.textContent = format(value, decimals)
    }
  }, [inView, reduced, value, decimals])

  return (
    <div ref={ref} className={className}>
      <p className="text-h2 font-medium tracking-[-0.03em] tabular-nums">
        <span ref={numRef}>{format(value, decimals)}</span>
        {suffix}
      </p>
      <p className="text-ink-secondary text-caption mt-3">{label}</p>
    </div>
  )
}
