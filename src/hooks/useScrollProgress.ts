import { useEffect, useRef, useState } from 'react'

/**
 * 0→1 progress of an element travelling through the viewport.
 * Drives the Method rule and the hero 3D stage. rAF-throttled; passive.
 */
export function useScrollProgress<T extends Element = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh
      const travelled = vh - rect.top
      const p = total === 0 ? 0 : travelled / total
      setProgress(Math.min(1, Math.max(0, p)))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}
