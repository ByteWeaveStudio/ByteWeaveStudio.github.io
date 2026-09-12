import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Fire once, then stop observing. Every reveal on this site is once-only. */
  once?: boolean
  rootMargin?: string
  threshold?: number | number[]
}

export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (or prerender) => show content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin, threshold },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [once, rootMargin, threshold])

  return { ref, inView }
}
