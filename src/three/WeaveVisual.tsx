import { Lazy3D } from './Lazy3D'
import { WeavePoster } from './WeavePoster'

const load = () => import('./WeaveScene')

export function WeaveVisual() {
  return (
    <Lazy3D
      load={load}
      className="aspect-square w-full"
      poster={<WeavePoster className="h-full w-full" />}
    />
  )
}
