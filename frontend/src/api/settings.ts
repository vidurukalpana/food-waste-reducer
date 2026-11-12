import { apiFetch } from './client'
import type { UserSettings } from './types'

export const settingsQueryKey = ['settings'] as const

export function getSettings(): Promise<UserSettings> {
  return apiFetch<UserSettings>('/api/users/me/settings')
}

export function updateSettings(settings: UserSettings): Promise<UserSettings> {
  return apiFetch<UserSettings>('/api/users/me/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
}
