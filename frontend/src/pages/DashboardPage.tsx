import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { itemsQueryKey, listItems, listUseSoon, useSoonQueryKey } from '../api/items'
import type { ExpiryStatus, ItemResponse } from '../api/types'
import { Alert } from '../components/Alert'
import { ArrowRightIcon, PlusIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { cardClass } from '../components/styles'
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

function HeroCard({ useSoonCount }: { useSoonCount: number | null }) {
  let headline = 'Checking your kitchen…'
  if (useSoonCount === 0) {
    headline = 'Nothing to rush this week'
  } else if (useSoonCount === 1) {
    headline = '1 item to use this week'
  } else if (useSoonCount !== null) {
    headline = `${useSoonCount} items to use this week`
  }

  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl bg-forest p-6 text-white sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 size-48 rounded-full bg-sage/30"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 right-24 size-32 rounded-full bg-ochre/40"
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sun">
          Next {USE_SOON_DAYS} days
        </p>
        <h2 className="mt-2 max-w-md font-display text-3xl leading-tight sm:text-4xl">
          {headline}
        </h2>
        <Link
          to="/items/new"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sun px-5 py-2.5 text-sm font-semibold text-forest transition hover:brightness-95"
        >
          <PlusIcon className="size-4" />
          Add item
        </Link>
      </div>
    </section>
  )
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
      <PageHeader title="Use soon" subtitle="What to eat first, before it goes to waste." />

      <HeroCard useSoonCount={useSoonQuery.isSuccess ? useSoonQuery.data.length : null} />

      {itemsQuery.isError && (
        <Alert className="mb-6">Could not load counts: {itemsQuery.error.message}</Alert>
      )}
      {counts && (
        <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {expiryStatusOrder.map((status) => {
            const style = expiryStyles[status]
            return (
              <li key={status} className={`${cardClass} p-4`}>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`size-2.5 rounded-full ${style.dot}`} />
                  {style.label}
                </p>
                <p className="mt-2 font-display text-4xl">{counts[status]}</p>
                <p className="text-xs text-forest/60">{style.range}</p>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl">Expiring within {USE_SOON_DAYS} days</h2>
        <Link
          to="/items"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ochre hover:underline"
        >
          All items
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      {useSoonQuery.isPending && <p className="text-forest/60">Loading items…</p>}
      {useSoonQuery.isError && <Alert>Could not load items: {useSoonQuery.error.message}</Alert>}
      {useSoonQuery.isSuccess && useSoonQuery.data.length === 0 && (
        <div className={`${cardClass} p-8 text-center`}>
          <p className="text-3xl" aria-hidden="true">
            🌿
          </p>
          <p className="mt-2 font-semibold">Nothing to use soon</p>
          <p className="text-sm text-forest/60">
            Everything in your kitchen is fresh for more than {USE_SOON_DAYS} days.
          </p>
        </div>
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
