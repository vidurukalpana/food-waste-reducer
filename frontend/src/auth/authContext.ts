import { createContext } from 'react'
import type { UserResponse } from '../api/types'

export type AuthContextValue = {
  token: string | null
  user: UserResponse | null
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
