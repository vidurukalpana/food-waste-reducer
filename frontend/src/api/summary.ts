import { apiFetch } from './client'
import type { MonthlySummary } from './types'

export function summaryQueryKey(month: string) {
  return ['summary', month] as const
}

export function getSummary(month: string): Promise<MonthlySummary> {
  return apiFetch<MonthlySummary>(`/api/summary?month=${encodeURIComponent(month)}`)
}
