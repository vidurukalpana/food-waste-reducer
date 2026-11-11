import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { createItem, itemsQueryKey } from '../api/items'
import type { ItemRequest } from '../api/types'
import { ItemForm } from '../components/ItemForm'
import { PageHeader } from '../components/PageHeader'

export function NewItemPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleSubmit = async (request: ItemRequest) => {
    await createItem(request)
    // Reload the list before showing it. It is not on screen during the form.
    await queryClient.invalidateQueries({ queryKey: itemsQueryKey, refetchType: 'all' })
    navigate('/items')
  }

  return (
    <div>
      <PageHeader
        title="Add item"
        subtitle="What did you bring home?"
        back={{ to: '/items', label: 'Items' }}
      />
      <ItemForm
        defaultValues={{ quantity: '1', unit: 'pcs' }}
        submitLabel="Save"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
