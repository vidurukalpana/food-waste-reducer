import { Link } from 'react-router'
import type { ItemResponse } from '../api/types'
import { expiryStyles } from '../utils/expiryStyles'
import {
  categoryEmoji,
  formatCategory,
  formatDate,
  formatDaysLeft,
  formatQuantity,
} from '../utils/format'
import { ExpiryBadge } from './ExpiryBadge'
import { cardClass } from './styles'

export function UseSoonCard({ item }: { item: ItemResponse }) {
  const style = expiryStyles[item.expiryStatus]
  const days = Math.abs(item.daysLeft)

  return (
    // min-w-0 lets the grid cell shrink. Long names then truncate.
    <li className="min-w-0">
      <Link
        to={`/items/${item.id}`}
        className={`${cardClass} flex items-center gap-4 p-3 pr-4 transition hover:-translate-y-0.5 hover:shadow-md`}
      >
        <span
          aria-hidden="true"
          className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl ${style.tile}`}
        >
          <span className="font-display text-2xl leading-none">{days}</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {days === 1 ? 'day' : 'days'}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate font-semibold">
              <span aria-hidden="true">{categoryEmoji(item.category)} </span>
              {item.name}
            </span>
            <ExpiryBadge status={item.expiryStatus} />
          </span>
          <span className={`block font-semibold ${style.text}`}>
            {formatDaysLeft(item.daysLeft)}
          </span>
          <span className="block truncate text-sm text-forest/60">
            {formatQuantity(item.quantity, item.unit)} · {formatCategory(item.category)} ·{' '}
            {formatDate(item.expiryDate)}
          </span>
        </span>
      </Link>
    </li>
  )
}
