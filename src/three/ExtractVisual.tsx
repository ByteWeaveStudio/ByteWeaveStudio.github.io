import { useState } from 'react'
import { ExtractPoster } from './ExtractPoster'
import { JsonPanel } from './JsonPanel'
import { Lazy3D } from './Lazy3D'

const load = () => import('./ExtractScene')

type SceneExtras = {
  activeField: string | null
  onHoverField: (id: string | null) => void
}

/**
 * Invoice in, JSON out.
 *
 * The page stays in 3D — that is the part worth rendering as an object on a
 * desk. The output is real HTML text, because the whole point is that it is
 * legible, and because a canvas cannot be selected, indexed or read by a
 * screen reader.
 *
 * Hover state is held here so both halves respond to each other: hovering a
 * line of JSON lights the region of the page it came from.
 */
export function ExtractVisual() {
  const [activeField, setActiveField] = useState<string | null>(null)

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-6">
        <Lazy3D<SceneExtras>
          load={load}
          className="h-full min-h-[240px] w-full lg:min-h-[420px]"
          sceneProps={{ activeField, onHoverField: setActiveField }}
          poster={<ExtractPoster className="h-full w-full" />}
        />
      </div>
      <div className="min-w-0 lg:col-span-6">
        <JsonPanel activeField={activeField} onHoverField={setActiveField} />
      </div>
    </div>
  )
}
