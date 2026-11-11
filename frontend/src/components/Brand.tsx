import { LeafIcon } from './icons'

export function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-full bg-sun text-forest">
        <LeafIcon className="size-5" />
      </span>
      <span className="font-display text-xl text-white">Food Waste Reducer</span>
    </span>
  )
}
