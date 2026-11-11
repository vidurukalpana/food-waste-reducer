import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { getItem, itemQueryKey, itemsQueryKey, updateItem } from '../api/items'
import type { ItemRequest, ItemResponse } from '../api/types'
import { Alert } from '../components/Alert'
import { ItemForm, type ItemFormValues } from '../components/ItemForm'
import { PageHeader } from '../components/PageHeader'

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
    return <p className="text-forest/60">Loading item…</p>
  }
  if (itemQuery.isError) {
    const notFound = itemQuery.error instanceof ApiError && itemQuery.error.status === 404
    return (
      <div>
        <Alert className="mb-4">
          {notFound ? 'Item not found' : `Could not load item: ${itemQuery.error.message}`}
        </Alert>
        <Link to="/items" className="font-semibold text-ochre hover:underline">
          Back to items
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Edit item"
        subtitle={itemQuery.data.name}
        back={{ to: '/items', label: 'Items' }}
      />
      <ItemForm
        key={itemQuery.data.id}
        defaultValues={toFormValues(itemQuery.data)}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
