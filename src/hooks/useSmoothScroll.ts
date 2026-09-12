import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Lenis smooth scroll, loaded lazily and skipped entirely under
 * prefers-reduced-motion (where hijacking the native scroll is exactly wrong).
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    let cleanup: (() => void) | undefined

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 1, touchMultiplier: 1.6 })
      let frame = requestAnimationFrame(function raf(time) {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      })
      cleanup = () => {
        cancelAnimationFrame(frame)
        lenis.destroy()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduced])
}
