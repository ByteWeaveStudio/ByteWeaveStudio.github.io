import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  PLATE_D,
  PLATE_W,
  PLATE_Y,
  STAGES,
  STAGE_OFFSETS,
  THINK_EDGES,
  THINK_NODES,
  THINK_ROUTE,
  TOTAL_MARKS,
} from './stages'

const INK = new THREE.Color('#54545c')
const ACCENT = new THREE.Color('#1f48ff')
const LIGHT = new THREE.Color('#c4c4c0')

/** The logo's own ramp, sampled from the artwork. */
const RAMP = ['#5170fe', '#7a6ff2', '#8e6cea', '#b06ade', '#d769d1', '#f568c7'].map(
  (c) => new THREE.Color(c),
)

/** easeOutQuart — matches --ease-out closely enough for this purpose. */
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4)

/** Each plate resolves in sequence over roughly 2.4s, then holds. */
function activation(elapsed: number, plate: number) {
  return ease((elapsed - 0.35 - plate * 0.38) / 1.0)
}

function Plates() {
  return (
    <>
      {PLATE_Y.map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[PLATE_W, 0.035, PLATE_D]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.24}
              roughness={0.12}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.2}
              depthWrite={false}
            />
          </mesh>
          {/* Precise hairline edge — this is what makes it read as engineered
              rather than as a glowing slab. */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(PLATE_W, 0.035, PLATE_D)]} />
            <lineBasicMaterial color="#8e8e8a" transparent opacity={0.65} />
          </lineSegments>
        </group>
      ))}
    </>
  )
}

function Marks() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1)
    g.rotateX(-Math.PI / 2) // lie flat on the plate
    return g
  }, [])

  // instanceColor must go through setColorAt: attaching an
  // InstancedBufferAttribute declaratively never sets three's
  // USE_INSTANCING_COLOR define, so every mark rendered black.
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const c = new THREE.Color()
    let i = 0
    for (const stage of STAGES) {
      for (const mark of stage) {
        c.copy(mark.accent ? ACCENT : mark.light ? LIGHT : INK)
        mesh.setColorAt(i, c)
        i++
      }
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime

    STAGES.forEach((stage, plate) => {
      const a = activation(t, plate)
      const offset = STAGE_OFFSETS[plate]
      const y = PLATE_Y[plate] + 0.03

      stage.forEach((mark, i) => {
        // Unresolved → resolved.
        const x = THREE.MathUtils.lerp(mark.fx, mark.x, a)
        const z = THREE.MathUtils.lerp(mark.fz, mark.z, a)
        dummy.position.set(x, y + (1 - a) * 0.35, z)
        dummy.scale.set(mark.sx * a, 1, mark.sz * a)
        dummy.updateMatrix()
        mesh.setMatrixAt(offset + i, dummy.matrix)
      })
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, TOTAL_MARKS]} frustumCulled={false}>
      <meshBasicMaterial toneMapped={false} transparent opacity={0.92} />
    </instancedMesh>
  )
}

/** Graph edges on the THINK plate. One route is illuminated. */
function ThinkEdges() {
  const y = PLATE_Y[2] + 0.028

  const objects = useMemo(() => {
    const base: number[] = []
    const route: number[] = []
    THINK_EDGES.forEach(([a, c], i) => {
      const target = THINK_ROUTE.has(i) ? route : base
      target.push(THINK_NODES[a][0], y, THINK_NODES[a][1])
      target.push(THINK_NODES[c][0], y, THINK_NODES[c][1])
    })
    const make = (verts: number[], color: string, opacity: number) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
      return new THREE.LineSegments(
        g,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
      )
    }
    return [make(base, '#b8b8b4', 0.85), make(route, '#1f48ff', 1)]
  }, [y])

  return (
    <>
      {objects.map((o, i) => (
        <primitive key={i} object={o} />
      ))}
    </>
  )
}

/**
 * The weave itself: threads passing through all four plates, crossing between
 * levels so the stack reads as one woven object rather than four shelves.
 *
 * Native THREE.Line rather than drei's Line2 — hairlines are the intent here,
 * and Line2 would pull three-stdlib into the lazy chunk for no visual gain.
 */
function Threads() {
  const objects = useMemo(() => {
    // Three groups of four strands. Each group is a rope: the four strands sit
    // 90 degrees apart around a shared axis and twist together, so they cross
    // each other continuously rather than only in one plane.
    //
    // The run is anchored plate-to-plate — bottom plate to top plate, nothing
    // beyond. Threads that overshoot the stack cross in empty space above it,
    // which reads as loose ends rather than as stitching.
    const centres = [-1.0, 0, 1.0]
    const STRANDS = 4
    const AMP = 0.16
    const TURNS = 1.5
    const bottom = PLATE_Y[0]
    const top = PLATE_Y[3]
    const out: THREE.Line[] = []

    centres.forEach((cx, j) => {
      for (let k = 0; k < STRANDS; k++) {
        const phase = (k / STRANDS) * Math.PI * 2
        const pts: THREE.Vector3[] = []
        for (let i = 0; i <= 80; i++) {
          const t = i / 80
          const a = t * Math.PI * 2 * TURNS + phase
          pts.push(
            new THREE.Vector3(
              cx + AMP * Math.sin(a),
              THREE.MathUtils.lerp(bottom, top, t),
              AMP * 0.6 * Math.cos(a),
            ),
          )
        }
        out.push(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({
              color: RAMP[Math.min(RAMP.length - 1, j * 2 + (k % 2))],
              transparent: true,
              opacity: 0.5,
            }),
          ),
        )
      }
    })
    return out
  }, [])

  return (
    <>
      {objects.map((o, i) => (
        <primitive key={i} object={o} />
      ))}
    </>
  )
}

/** Pointer parallax, capped at 6°, damped. No auto-rotation, ever. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { size } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const px = (state.pointer.x || 0) * (size.width > 0 ? 1 : 0)
    target.current.y = px * THREE.MathUtils.degToRad(6)
    target.current.x = -(state.pointer.y || 0) * THREE.MathUtils.degToRad(4)
    const k = 1 - Math.pow(0.0015, delta) // frame-rate independent damping
    g.rotation.y += (target.current.y - g.rotation.y) * k
    g.rotation.x += (target.current.x - g.rotation.x) * k
  })

  return <group ref={group}>{children}</group>
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -4]} intensity={0.5} />
      <Rig>
        <group rotation={[0, -0.42, 0]}>
          <Plates />
          <Marks />
          <ThinkEdges />
          <Threads />
        </group>
      </Rig>
    </>
  )
}

export default function WeaveScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 24, position: [4.6, 6.2, 10.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}
