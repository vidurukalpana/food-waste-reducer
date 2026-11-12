import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getSummary, summaryQueryKey } from '../api/summary'
import type { CategorySummary } from '../api/types'
import { Alert } from '../components/Alert'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { cardClass } from '../components/styles'
import { categoryEmoji, formatCategory } from '../utils/format'
import { currentMonth, formatMonth, shiftMonth } from '../utils/month'

const arrowClass =
  'grid size-10 place-items-center rounded-full bg-white text-forest shadow-sm ring-1 ring-forest/10 transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-40'

type MonthPickerProps = {
  month: string
  latest: string
  onChange: (month: string) => void
}

function MonthPicker({ month, latest, onChange }: MonthPickerProps) {
  const isLatest = month >= latest
  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => onChange(shiftMonth(month, -1))}
        className={arrowClass}
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <p aria-live="polite" className="min-w-40 text-center font-display text-2xl">
        {formatMonth(month)}
      </p>
      <button
        type="button"
        aria-label="Next month"
        disabled={isLatest}
        onClick={() => onChange(shiftMonth(month, 1))}
        className={arrowClass}
      >
        <ArrowRightIcon className="size-4" />
      </button>
    </div>
  )
}

type StatCardProps = {
  label: string
  value: string
  dotClass: string
  note: string
}

function StatCard({ label, value, dotClass, note }: StatCardProps) {
  return (
    <li className={`${cardClass} p-4`}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className={`size-2.5 rounded-full ${dotClass}`} />
        {label}
      </p>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <p className="text-xs text-forest/60">{note}</p>
    </li>
  )
}

function CategoryBars({ categories }: { categories: CategorySummary[] }) {
  // Bar lengths are relative to the busiest category.
  const largest = Math.max(...categories.map((c) => c.used + c.wasted))
  return (
    <ul className="flex flex-col gap-4">
      {categories.map((c) => {
        const total = c.used + c.wasted
        return (
          <li key={c.category}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold">
                <span aria-hidden="true">{categoryEmoji(c.category)} </span>
                {formatCategory(c.category)}
              </span>
              <span className="text-forest/70">
                {c.used} used · {c.wasted} wasted
              </span>
            </div>
            <div
              aria-hidden="true"
              className="flex h-3 overflow-hidden rounded-full bg-mint"
              style={{ width: `${(total / largest) * 100}%` }}
            >
              <div className="bg-sage" style={{ flexGrow: c.used }} />
              <div className="bg-ochre" style={{ flexGrow: c.wasted }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function SummaryPage() {
  const latest = currentMonth()
  const [month, setMonth] = useState(latest)
  const summaryQuery = useQuery({
    queryKey: summaryQueryKey(month),
    queryFn: () => getSummary(month),
  })

  return (
    <div>
      <PageHeader title="Monthly summary" subtitle="What you used and wasted, month by month." />
      <MonthPicker month={month} latest={latest} onChange={setMonth} />

      {summaryQuery.isPending && <p className="text-forest/60">Loading summary…</p>}
      {summaryQuery.isError && (
        <Alert>Could not load the summary: {summaryQuery.error.message}</Alert>
      )}
      {summaryQuery.isSuccess && (
        <>
          <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="Used"
              value={String(summaryQuery.data.used)}
              dotClass="bg-sage"
              note="Eaten or cooked"
            />
            <StatCard
              label="Wasted"
              value={String(summaryQuery.data.wasted)}
              dotClass="bg-ochre"
              note="Thrown away"
            />
            <li className="col-span-2 rounded-2xl bg-forest p-4 text-white shadow-sm sm:col-span-1">
              <p className="text-sm font-semibold text-sun">Waste rate</p>
              <p className="mt-2 font-display text-4xl">{summaryQuery.data.wasteRate}%</p>
              <p className="text-xs text-white/70">Wasted out of all closed items</p>
            </li>
          </ul>

          <section className={`${cardClass} p-6`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl">By category</h2>
              <p className="flex items-center gap-4 text-xs text-forest/70">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-sage" /> Used
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-ochre" /> Wasted
                </span>
              </p>
            </div>
            {summaryQuery.data.categories.length === 0 ? (
              <p className="py-6 text-center text-sm text-forest/60">
                Nothing marked used or wasted in {formatMonth(month)}.
              </p>
            ) : (
              <CategoryBars categories={summaryQuery.data.categories} />
            )}
          </section>
          <p className="mt-3 text-xs text-forest/50">
            Counts items marked used or wasted in the month (Sri Lanka time).
          </p>
        </>
      )}
    </div>
  )
}
