import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ApiError, apiFetch } from '../api/client'
import type { UserResponse } from '../api/types'
import { AuthContext, type AuthContextValue } from './authContext'
import { tokenStorage } from './tokenStorage'

function isRejectedToken(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}

async function fetchCurrentUser(): Promise<UserResponse> {
  try {
    return await apiFetch<UserResponse>('/api/auth/me')
  } catch (error) {
    // An expired or rejected token is removed. The next page load starts logged out.
    if (isRejectedToken(error)) {
      tokenStorage.clear()
    }
    throw error
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [storedToken, setStoredToken] = useState<string | null>(() => tokenStorage.get())

  const login = useCallback((newToken: string) => {
    tokenStorage.set(newToken)
    setStoredToken(newToken)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setStoredToken(null)
    queryClient.clear()
  }, [queryClient])

  const meQuery = useQuery({
    queryKey: ['me', storedToken],
    queryFn: fetchCurrentUser,
    enabled: storedToken !== null,
    retry: false,
  })

  const token = isRejectedToken(meQuery.error) ? null : storedToken

  const value = useMemo<AuthContextValue>(
    () => ({ token, user: meQuery.data ?? null, login, logout }),
    [token, meQuery.data, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
