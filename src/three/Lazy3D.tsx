import { Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Every 3D scene takes this, so it can pause its frameloop when off-screen. */
export type SceneProps = { active: boolean }

function canRunWebGL() {
  if (typeof window === 'undefined') return false
  // A weak device renders a throttled canvas; the poster is genuinely better.
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

/**
 * The single place the 3D gating rules live.
 *
 * A canvas mounts only when all of these hold: motion is allowed, the viewport
 * is at least 1024px, the element is in view, WebGL exists, and the device has
 * more than four cores. Otherwise the poster stands in — which on mobile is a
 * genuinely better result than a throttled canvas, not a degradation.
 *
 * The scene chunk is imported after first paint via requestIdleCallback, so
 * three.js can never land on the critical path. The poster renders immediately
 * (it is in the prerendered HTML) and cross-fades out once the canvas is up,
 * so there is no layout shift and no spinner.
 */
export function Lazy3D<P extends object = Record<string, never>>({
  load,
  poster,
  className = '',
  sceneProps,
}: {
  load: () => Promise<{ default: ComponentType<SceneProps & P> }>
  poster: ReactNode
  className?: string
  /** Extra props forwarded to the scene, e.g. shared hover state. */
  sceneProps?: P
}) {
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '200px', once: false })
  const [Scene, setScene] = useState<ComponentType<SceneProps & P> | null>(null)

  useEffect(() => {
    if (Scene || reduced || !isDesktop || !inView || !canRunWebGL()) return
    let cancelled = false
    const start = () => {
      void load().then((m) => {
        if (!cancelled) setScene(() => m.default)
      })
    }
    const id = window.requestIdleCallback?.(start) ?? window.setTimeout(start, 400)
    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number)
      else clearTimeout(id as number)
    }
  }, [Scene, reduced, isDesktop, inView, load])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)] ${
          Scene ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {poster}
      </div>

      {Scene ? (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            {/* Stops rendering entirely once scrolled past. */}
            <Scene active={inView} {...(sceneProps as P)} />
          </Suspense>
        </div>
      ) : null}
    </div>
  )
}
