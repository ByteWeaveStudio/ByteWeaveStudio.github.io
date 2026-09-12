import type { ReactNode } from 'react'

type Tone = 'base' | 'sunk' | 'dark' | 'cool' | 'warm'

const TONES: Record<Tone, string> = {
  base: 'bg-bg text-ink',
  sunk: 'bg-sunk text-ink',
  dark: 'bg-dark text-dark-ink',
  // Tinted bands, kept light enough that body copy stays AA on them.
  cool: 'bg-tint-cool text-ink',
  warm: 'bg-tint-warm text-ink',
}

const SPACE = {
  sm: 'py-section-sm',
  md: 'py-section-sm md:py-section',
  lg: 'py-section md:py-section-lg',
  xl: 'py-section-lg md:py-section-xl',
} as const

export function Section({
  id,
  tone = 'base',
  space = 'lg',
  className = '',
  children,
  labelledBy,
  card = false,
}: {
  id?: string
  tone?: Tone
  space?: keyof typeof SPACE
  className?: string
  children: ReactNode
  labelledBy?: string
  /** Join the homepage's stacked-card rhythm. */
  card?: boolean
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${TONES[tone]} ${SPACE[space]} ${card ? 'stack-card' : ''} ${className}`}
    >
      {children}
    </section>
  )
}
