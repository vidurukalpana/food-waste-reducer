import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { deleteItem, itemsQueryKey, listItems, markItemUsed, markItemWasted } from '../api/items'
import type { ItemResponse } from '../api/types'
import { Alert } from '../components/Alert'
import { PlusIcon } from '../components/icons'
import { ItemCard } from '../components/ItemCard'
import { PageHeader } from '../components/PageHeader'
import { cardClass, primaryButton } from '../components/styles'

export function ItemsPage() {
  const queryClient = useQueryClient()
  const itemsQuery = useQuery({ queryKey: itemsQueryKey, queryFn: listItems })

  const mutationOptions = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsQueryKey }),
  }
  const usedMutation = useMutation({ mutationFn: markItemUsed, ...mutationOptions })
  const wastedMutation = useMutation({ mutationFn: markItemWasted, ...mutationOptions })
  const deleteMutation = useMutation({ mutationFn: deleteItem, ...mutationOptions })

  const mutations = [usedMutation, wastedMutation, deleteMutation]
  const isBusy = mutations.some((mutation) => mutation.isPending)
  const actionError = mutations.find((mutation) => mutation.isError)?.error

  // A new action clears the error from an earlier one.
  const resetErrors = () => mutations.forEach((mutation) => mutation.reset())

  const handleUsed = (item: ItemResponse) => {
    resetErrors()
    usedMutation.mutate(item.id)
  }

  const handleWasted = (item: ItemResponse) => {
    resetErrors()
    wastedMutation.mutate(item.id)
  }

  const handleDelete = (item: ItemResponse) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      resetErrors()
      deleteMutation.mutate(item.id)
    }
  }

  const count = itemsQuery.isSuccess ? itemsQuery.data.length : null

  return (
    <div>
      <PageHeader
        title="My pantry"
        subtitle={
          count === null
            ? 'Everything in your kitchen.'
            : `${count} active ${count === 1 ? 'item' : 'items'}, soonest expiry first.`
        }
        action={
          <Link to="/items/new" className={primaryButton}>
            <PlusIcon className="size-4" />
            Add item
          </Link>
        }
      />

      {actionError && <Alert className="mb-4">{actionError.message}</Alert>}

      {itemsQuery.isPending && <p className="text-forest/60">Loading items…</p>}
      {itemsQuery.isError && <Alert>Could not load items: {itemsQuery.error.message}</Alert>}
      {itemsQuery.isSuccess && itemsQuery.data.length === 0 && (
        <div className={`${cardClass} p-8 text-center`}>
          <p className="text-3xl" aria-hidden="true">
            🧺
          </p>
          <p className="mt-2 font-semibold">No items yet</p>
          <p className="text-sm text-forest/60">
            Add the food in your kitchen to start tracking it.
          </p>
        </div>
      )}
      {itemsQuery.isSuccess && itemsQuery.data.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {itemsQuery.data.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              disabled={isBusy}
              onUsed={handleUsed}
              onWasted={handleWasted}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
