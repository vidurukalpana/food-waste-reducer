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

type ItemCardProps = {
  item: ItemResponse
  disabled: boolean
  onUsed: (item: ItemResponse) => void
  onWasted: (item: ItemResponse) => void
  onDelete: (item: ItemResponse) => void
}

const actionClass =
  'rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'

export function ItemCard({ item, disabled, onUsed, onWasted, onDelete }: ItemCardProps) {
  return (
    <li className={`${cardClass} flex flex-col p-4`}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-mint text-xl"
        >
          {categoryEmoji(item.category)}
        </span>
        <div className="min-w-0 flex-1">
          <Link to={`/items/${item.id}`} className="block truncate font-semibold hover:underline">
            {item.name}
          </Link>
          <p className="text-sm text-forest/60">
            {formatQuantity(item.quantity, item.unit)} · {formatCategory(item.category)}
          </p>
        </div>
        <ExpiryBadge status={item.expiryStatus} />
      </div>

      <p className="mt-3 text-sm">
        <span className={`font-semibold ${expiryStyles[item.expiryStatus].text}`}>
          {formatDaysLeft(item.daysLeft)}
        </span>
        <span className="text-forest/60"> · {formatDate(item.expiryDate)}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onUsed(item)}
          className={`${actionClass} bg-sage-light text-forest hover:bg-sage hover:text-white`}
        >
          Used
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onWasted(item)}
          className={`${actionClass} bg-ochre/10 text-ochre hover:bg-ochre hover:text-white`}
        >
          Wasted
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(item)}
          className={`${actionClass} ml-auto text-expired hover:bg-expired/10`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
