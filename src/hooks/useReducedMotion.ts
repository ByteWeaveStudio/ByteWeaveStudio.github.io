import { useMediaQuery } from './useMediaQuery'

/**
 * Single source of truth for motion gating. CSS has a global
 * prefers-reduced-motion override in base.css; this is its JS counterpart
 * for anything driven by Motion or requestAnimationFrame.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
