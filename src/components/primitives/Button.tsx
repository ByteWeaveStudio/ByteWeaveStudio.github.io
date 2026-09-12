import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from './Icon'

type Variant = 'primary' | 'secondary' | 'inverse' | 'outlineDark' | 'ghost'

/**
 * Dark surfaces get their own variants rather than className overrides:
 * Tailwind resolves conflicting utilities by their order in the stylesheet,
 * not in the class attribute, so `className="text-ink"` on top of a variant's
 * `text-white` silently produced white-on-white buttons.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-accent',
  secondary: 'bg-transparent text-ink ring-1 ring-inset ring-line-strong hover:ring-ink',
  inverse: 'bg-white text-ink hover:bg-accent hover:text-white',
  outlineDark:
    'bg-transparent text-dark-ink ring-1 ring-inset ring-dark-line hover:ring-dark-ink',
  ghost: 'bg-transparent text-ink hover:text-accent px-0',
}

type Common = {
  variant?: Variant
  children: ReactNode
  /** Hide the arrow for buttons that aren't a forward action (e.g. submit). */
  arrow?: boolean
  className?: string
}

/**
 * The arrow is the one interaction carried over from the old site: it rotates
 * 45° into the brand's up-right mark while a masked duplicate slides in behind
 * it. The original also faded the background to transparent on hover, which
 * tanked contrast — dropped.
 */
function Inner({ children, arrow }: { children: ReactNode; arrow: boolean }) {
  return (
    <>
      <span className="relative z-10">{children}</span>
      {arrow ? (
        <span aria-hidden className="relative z-10 block size-4 overflow-hidden">
          <ArrowRight className="absolute inset-0 size-4 transition-[transform,opacity] duration-[380ms] ease-[var(--ease-out)] group-hover:-translate-y-full group-hover:translate-x-full group-hover:rotate-45" />
          <ArrowRight className="absolute inset-0 size-4 -translate-x-full translate-y-full -rotate-45 transition-transform duration-[380ms] ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0" />
        </span>
      ) : null}
    </>
  )
}

const SHELL =
  'group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[0.9375rem] font-medium ' +
  'transition-colors duration-200 ease-[var(--ease-out)] select-none'

export function Button({
  variant = 'primary',
  children,
  arrow = true,
  className = '',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${SHELL} ${VARIANTS[variant]} ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  children,
  arrow = true,
  className = '',
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${SHELL} ${VARIANTS[variant]} ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  )
}

/** Same shell, but routed — no full page load for internal links. */
export function ButtonNavLink({
  to,
  variant = 'primary',
  children,
  arrow = true,
  className = '',
}: Common & { to: string }) {
  return (
    <Link to={to} className={`${SHELL} ${VARIANTS[variant]} ${className}`}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  )
}
