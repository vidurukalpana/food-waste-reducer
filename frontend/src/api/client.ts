import { tokenStorage } from '../auth/tokenStorage'
import type { ProblemDetail } from './types'

// Empty in development. Vite proxies API calls to the backend.
const API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

function isProblemDetail(body: unknown): body is ProblemDetail {
  return typeof body === 'object' && body !== null && 'status' in body && 'title' in body
}

async function toApiError(response: Response): Promise<ApiError> {
  const fallback = `Request failed with status ${response.status}`
  const contentType = response.headers.get('Content-Type') ?? ''
  if (!contentType.includes('json')) {
    return new ApiError(response.status, fallback)
  }
  const body: unknown = await response.json()
  if (!isProblemDetail(body)) {
    return new ApiError(response.status, fallback)
  }
  return new ApiError(response.status, body.detail ?? body.title, body.errors)
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get()
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw await toApiError(response)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}
