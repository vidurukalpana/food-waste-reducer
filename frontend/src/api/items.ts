import { apiFetch } from './client'
import type { ItemResponse } from './types'

export const itemsQueryKey = ['items'] as const

export function listItems(): Promise<ItemResponse[]> {
  return apiFetch<ItemResponse[]>('/api/items')
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
