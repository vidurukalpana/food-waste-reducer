import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteItem, itemsQueryKey, listItems, markItemUsed, markItemWasted } from '../api/items'
import type { ItemResponse } from '../api/types'
import { ItemCard } from '../components/ItemCard'

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

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My items</h1>

      {actionError && (
        <p role="alert" className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-sm">
          {actionError.message}
        </p>
      )}

      {itemsQuery.isPending && <p>Loading items…</p>}
      {itemsQuery.isError && (
        <p role="alert" className="rounded border border-red-500 bg-red-50 p-3 text-sm">
          Could not load items: {itemsQuery.error.message}
        </p>
      )}
      {itemsQuery.isSuccess && itemsQuery.data.length === 0 && (
        <p className="text-gray-600">No items yet.</p>
      )}
      {itemsQuery.isSuccess && itemsQuery.data.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2">
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
