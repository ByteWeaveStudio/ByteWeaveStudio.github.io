import type { ReactNode } from 'react'

/**
 * Small uppercase label. Purely typographic — no icon, no pill, no colour.
 *
 * Dark surfaces select a tone rather than passing a text colour in className:
 * Tailwind resolves conflicts by stylesheet order, so an override silently
 * lost to the base colour and left the label at 3.6:1.
 */
export function Eyebrow({
  children,
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  const ink = tone === 'dark' ? 'text-dark-ink-secondary' : 'text-ink-secondary'
  return <p className={`text-eyebrow uppercase ${ink} ${className}`}>{children}</p>
}
