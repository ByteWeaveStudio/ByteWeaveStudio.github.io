import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { SceneProps } from './Lazy3D'
import { PAPER, drawInvoice } from './invoice'
import {
  ARC_LIFT,
  DOC,
  DOC_LEAN,
  DOC_POS,
  DOC_TILT,
  EXIT_X,
  FIELDS,
  exitY,
  pageToWorld,
} from './extraction'

type Props = SceneProps & {
  activeField: string | null
  onHoverField: (id: string | null) => void
}

const INK = new THREE.Color('#54545c')
const LIGHT = new THREE.Color('#c4c4c0')
const ACCENT = new THREE.Color('#1f48ff')
const HAIRLINE = '#9a9a96'

/** A flat unit quad lying in the page plane. */
function flatQuad() {
  const g = new THREE.PlaneGeometry(1, 1)
  g.rotateX(-Math.PI / 2)
  return g
}

/**
 * The sheet: the invoice drawn into a canvas and mapped onto a plane.
 *
 * A texture rather than 3D text — it gives real type and real numbers at a
 * fraction of the cost of loading a font into three, and it is the same layout
 * the SVG fallback renders.
 */
function Sheet() {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const RES = 2.5 // enough to stay crisp at the size this renders
    const canvas = document.createElement('canvas')
    canvas.width = PAPER.w * RES
    canvas.height = PAPER.h * RES
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.scale(RES, RES)
    drawInvoice(ctx)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])

  // The first draw can land before Geist has loaded, leaving the invoice set
  // in a fallback face. Redraw once the webfonts are ready.
  useEffect(() => {
    if (!texture) return
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (cancelled) return
      const canvas = texture.image as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(canvas.width / PAPER.w, canvas.height / PAPER.h)
      drawInvoice(ctx)
      texture.needsUpdate = true
    })
    return () => {
      cancelled = true
    }
  }, [texture])

  const plane = useMemo(() => {
    const g = new THREE.PlaneGeometry(DOC.w, DOC.d)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  const edges = useMemo(() => new THREE.EdgesGeometry(plane), [plane])

  return (
    <>
      <mesh geometry={plane}>
        <meshBasicMaterial map={texture ?? undefined} toneMapped={false} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={HAIRLINE} transparent opacity={0.75} />
      </lineSegments>
    </>
  )
}

/**
 * The box marking a detected field. Rendered in its final state — the visual
 * shows the result, not a replay of the pipeline — so the only thing that
 * changes here is the hover highlight.
 */
function FieldMarker({
  index,
  active,
  onHover,
}: {
  index: number
  active: boolean
  onHover: (id: string | null) => void
}) {
  const field = FIELDS[index]
  const low = field.confidence < 0.8

  const { fill, outline } = useMemo(() => {
    const fill = new THREE.Mesh(
      flatQuad(),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.1,
        toneMapped: false,
        depthWrite: false,
      }),
    )
    fill.position.set(field.src.x, 0.026, field.src.z)
    fill.scale.set(field.src.w, 1, field.src.h)

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(field.src.w, 0.001, field.src.h)),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 }),
    )
    outline.position.set(field.src.x, 0.03, field.src.z)
    outline.raycast = () => {}

    return { fill, outline }
  }, [field])

  useEffect(() => {
    const tone = active || low ? ACCENT : INK
    const fm = fill.material as THREE.MeshBasicMaterial
    fm.opacity = active ? 0.22 : 0.1
    fm.color.copy(tone)
    const om = outline.material as THREE.LineBasicMaterial
    om.opacity = active ? 1 : 0.8
    om.color.copy(tone)
  }, [active, low, fill, outline])

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(field.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <primitive object={fill} />
      <primitive object={outline} />
    </group>
  )
}

/**
 * The page: upright but leaning back, turned toward the JSON panel. The two
 * nested rotations match `pageToWorld` in extraction.ts, which is what the
 * arcs use to find their source points.
 */
function Page({
  activeField,
  onHover,
}: {
  activeField: string | null
  onHover: (id: string | null) => void
}) {
  return (
    <group position={DOC_POS} rotation={[0, DOC_TILT, 0]}>
      <group rotation={[Math.PI / 2 - DOC_LEAN, 0, 0]}>
        <Sheet />
        {FIELDS.map((f, i) => (
          <FieldMarker key={f.id} index={i} active={activeField === f.id} onHover={onHover} />
        ))}
      </group>
    </group>
  )
}

/** The arc carrying a value off the page toward the panel. */
function FieldFlow({ index, active }: { index: number; active: boolean }) {
  const field = FIELDS[index]
  const low = field.confidence < 0.8

  const link = useMemo(() => {
    const a = new THREE.Vector3(...pageToWorld(field.src.x, field.src.z, 0.03))
    const b = new THREE.Vector3(EXIT_X, exitY(index), 0)
    const mid = a.clone().lerp(b, 0.5)
    mid.y += ARC_LIFT
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(56)),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 }),
    )
    // Arcs sweep the whole frame; leaving them raycastable meant one field
    // swallowed every pointer test.
    line.raycast = () => {}
    return line
  }, [field, index])

  useEffect(() => {
    const m = link.material as THREE.LineBasicMaterial
    m.opacity = active ? 0.95 : 0.4
    m.color.copy(active || low ? ACCENT : LIGHT)
  }, [active, low, link])

  return <primitive object={link} />
}

/** Pointer parallax, capped, damped. No auto-rotation. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    target.current.y = state.pointer.x * THREE.MathUtils.degToRad(5)
    target.current.x = -state.pointer.y * THREE.MathUtils.degToRad(2.5)
    const k = 1 - Math.pow(0.0015, delta)
    g.rotation.y += (target.current.y - g.rotation.y) * k
    g.rotation.x += (target.current.x - g.rotation.x) * k
  })
  return <group ref={group}>{children}</group>
}

function Scene({ active, activeField, onHoverField }: Props) {
  const setter = active ? onHoverField : () => {}
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 6, 8]} intensity={1.3} />
      <directionalLight position={[-5, 2, -3]} intensity={0.4} />
      <Rig>
        <Page activeField={activeField} onHover={setter} />
        {FIELDS.map((f, i) => (
          <FieldFlow key={f.id} index={i} active={activeField === f.id} />
        ))}
      </Rig>
    </>
  )
}

export default function ExtractScene({ active, activeField, onHoverField }: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      // Stops rendering when scrolled past, so two canvases never both run.
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 18, position: [1.6, 2.0, 10.0] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0.2, 0.02, 0)}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene active={active} activeField={activeField} onHoverField={onHoverField} />
    </Canvas>
  )
}
