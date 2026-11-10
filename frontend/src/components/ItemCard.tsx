import { Link } from 'react-router'
import type { ItemResponse } from '../api/types'
import { formatCategory, formatDate, formatQuantity } from '../utils/format'

type ItemCardProps = {
  item: ItemResponse
  disabled: boolean
  onUsed: (item: ItemResponse) => void
  onWasted: (item: ItemResponse) => void
  onDelete: (item: ItemResponse) => void
}

const buttonClass = 'rounded border px-3 py-1 text-sm disabled:opacity-50'

export function ItemCard({ item, disabled, onUsed, onWasted, onDelete }: ItemCardProps) {
  return (
    <li className="rounded-md border border-gray-300 p-4">
      <Link to={`/items/${item.id}`} className="font-semibold hover:underline">
        {item.name}
      </Link>
      <p className="text-sm text-gray-600">
        {formatQuantity(item.quantity, item.unit)} · {formatCategory(item.category)} · Expires{' '}
        {formatDate(item.expiryDate)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onUsed(item)}
          className={`${buttonClass} border-gray-700`}
        >
          Used
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onWasted(item)}
          className={`${buttonClass} border-gray-700`}
        >
          Wasted
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(item)}
          className={`${buttonClass} border-red-600 text-red-700`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
