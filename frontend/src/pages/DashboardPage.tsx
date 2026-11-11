import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { itemsQueryKey, listItems, listUseSoon, useSoonQueryKey } from '../api/items'
import type { ExpiryStatus, ItemResponse } from '../api/types'
import { UseSoonCard } from '../components/UseSoonCard'
import { expiryStatusOrder, expiryStyles } from '../utils/expiryStyles'

const USE_SOON_DAYS = 7

function countByStatus(items: ItemResponse[]): Record<ExpiryStatus, number> {
  const counts: Record<ExpiryStatus, number> = { EXPIRED: 0, URGENT: 0, SOON: 0, FRESH: 0 }
  for (const item of items) {
    counts[item.expiryStatus] += 1
  }
  return counts
}

export function DashboardPage() {
  // All active items for the counts. FRESH items are not in the use-soon list.
  const itemsQuery = useQuery({ queryKey: itemsQueryKey, queryFn: listItems })
  const useSoonQuery = useQuery({
    queryKey: useSoonQueryKey(USE_SOON_DAYS),
    queryFn: () => listUseSoon(USE_SOON_DAYS),
  })
  const counts = itemsQuery.isSuccess ? countByStatus(itemsQuery.data) : null

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Use soon</h1>

      {itemsQuery.isError && (
        <p role="alert" className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-sm">
          Could not load counts: {itemsQuery.error.message}
        </p>
      )}
      {counts && (
        <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {expiryStatusOrder.map((status) => {
            const style = expiryStyles[status]
            return (
              <li key={status} className={`rounded-md border-2 p-3 ${style.card}`}>
                <p className="text-sm font-medium">{style.label}</p>
                <p className="text-2xl font-bold">{counts[status]}</p>
              </li>
            )
          })}
        </ul>
      )}

      <h2 className="mb-3 text-lg font-semibold">Expiring within {USE_SOON_DAYS} days</h2>
      {useSoonQuery.isPending && <p>Loading items…</p>}
      {useSoonQuery.isError && (
        <p role="alert" className="rounded border border-red-500 bg-red-50 p-3 text-sm">
          Could not load items: {useSoonQuery.error.message}
        </p>
      )}
      {useSoonQuery.isSuccess && useSoonQuery.data.length === 0 && (
        <p className="text-gray-600">
          Nothing to use soon.{' '}
          <Link to="/items" className="underline">
            See all items
          </Link>
        </p>
      )}
      {useSoonQuery.isSuccess && useSoonQuery.data.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2">
          {useSoonQuery.data.map((item) => (
            <UseSoonCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  )
}
