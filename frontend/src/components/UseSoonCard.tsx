import { Link } from 'react-router'
import type { ItemResponse } from '../api/types'
import { expiryStyles } from '../utils/expiryStyles'
import { formatCategory, formatDate, formatDaysLeft, formatQuantity } from '../utils/format'

export function UseSoonCard({ item }: { item: ItemResponse }) {
  const style = expiryStyles[item.expiryStatus]

  return (
    <li className={`rounded-md border-2 p-4 ${style.card}`}>
      <div className="flex items-start justify-between gap-2">
        <Link to={`/items/${item.id}`} className="font-semibold hover:underline">
          {item.name}
        </Link>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
          {style.label}
        </span>
      </div>
      <p className="mt-1 font-medium">{formatDaysLeft(item.daysLeft)}</p>
      <p className="text-sm text-gray-700">
        {formatQuantity(item.quantity, item.unit)} · {formatCategory(item.category)} ·{' '}
        {formatDate(item.expiryDate)}
      </p>
    </li>
  )
}
