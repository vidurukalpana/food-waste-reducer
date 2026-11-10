import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { getItem, itemQueryKey, itemsQueryKey, updateItem } from '../api/items'
import type { ItemRequest, ItemResponse } from '../api/types'
import { ItemForm, type ItemFormValues } from '../components/ItemForm'

function toFormValues(item: ItemResponse): ItemFormValues {
  return {
    name: item.name,
    category: item.category,
    quantity: String(item.quantity),
    unit: item.unit,
    expiryDate: item.expiryDate,
    barcode: item.barcode ?? '',
  }
}

export function ItemDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const itemQuery = useQuery({ queryKey: itemQueryKey(id), queryFn: () => getItem(id) })

  const handleSubmit = async (request: ItemRequest) => {
    await updateItem(id, request)
    // Reload the list before showing it. It is not on screen during the form.
    await queryClient.invalidateQueries({ queryKey: itemsQueryKey, refetchType: 'all' })
    navigate('/items')
  }

  if (itemQuery.isPending) {
    return <p>Loading item…</p>
  }
  if (itemQuery.isError) {
    const notFound = itemQuery.error instanceof ApiError && itemQuery.error.status === 404
    return (
      <div>
        <p role="alert" className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-sm">
          {notFound ? 'Item not found' : `Could not load item: ${itemQuery.error.message}`}
        </p>
        <Link to="/items" className="underline">
          Back to items
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit item</h1>
      <ItemForm
        key={itemQuery.data.id}
        defaultValues={toFormValues(itemQuery.data)}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
