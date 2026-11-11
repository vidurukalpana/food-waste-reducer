import { apiFetch } from './client'
import type { ItemRequest, ItemResponse } from './types'

export const itemsQueryKey = ['items'] as const

export function itemQueryKey(id: string) {
  return [...itemsQueryKey, id] as const
}

// Under itemsQueryKey. Item changes refresh this list too.
export function useSoonQueryKey(days: number) {
  return [...itemsQueryKey, 'use-soon', days] as const
}

export function listItems(): Promise<ItemResponse[]> {
  return apiFetch<ItemResponse[]>('/api/items')
}

export function listUseSoon(days: number): Promise<ItemResponse[]> {
  return apiFetch<ItemResponse[]>(`/api/items/use-soon?days=${days}`)
}

export function getItem(id: string): Promise<ItemResponse> {
  return apiFetch<ItemResponse>(`/api/items/${id}`)
}

export function createItem(request: ItemRequest): Promise<ItemResponse> {
  return apiFetch<ItemResponse>('/api/items', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateItem(id: string, request: ItemRequest): Promise<ItemResponse> {
  return apiFetch<ItemResponse>(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function markItemUsed(id: string): Promise<ItemResponse> {
  return apiFetch<ItemResponse>(`/api/items/${id}/used`, { method: 'POST' })
}

export function markItemWasted(id: string): Promise<ItemResponse> {
  return apiFetch<ItemResponse>(`/api/items/${id}/wasted`, { method: 'POST' })
}

export function deleteItem(id: string): Promise<void> {
  return apiFetch<void>(`/api/items/${id}`, { method: 'DELETE' })
}
