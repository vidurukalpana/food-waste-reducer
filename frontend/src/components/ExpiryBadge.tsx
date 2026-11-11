import type { ExpiryStatus } from '../api/types'
import { expiryStyles } from '../utils/expiryStyles'

export function ExpiryBadge({ status }: { status: ExpiryStatus }) {
  const style = expiryStyles[status]
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
    >
      {style.label}
    </span>
  )
}
