import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

/**
 * The only entrance animation on the site: 8–16px of travel plus an opacity
 * fade, once. Deliberately not per-element — wrap a group and stagger with
 * `delay`, so sections arrive as compositions rather than as 90 identical
 * fade-ups (which is what made the old AOS implementation read as noise).
 *
 * The hidden state lives in CSS behind `html.js`, not in an inline style, for
 * two reasons: without JavaScript the prerendered HTML stays fully visible
 * instead of rendering as a blank page, and under prefers-reduced-motion the
 * content shows immediately rather than waiting on an observer.
 */
export function Reveal({
  delay = 0,
  distance = 12,
  className = '',
  children,
}: {
  delay?: number
  distance?: number
  className?: string
  children: ReactNode
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      data-reveal={inView ? 'in' : 'out'}
      className={`reveal ${className}`}
      style={
        {
          transitionDelay: `${delay}ms`,
          '--reveal-distance': `${distance}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
