export type UserResponse = {
  id: string
  email: string
}

export type RegisterRequest = {
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type Category =
  'DAIRY' | 'MEAT' | 'SEAFOOD' | 'VEGETABLES' | 'FRUITS' | 'BAKERY' | 'PANTRY' | 'FROZEN' | 'OTHER'

export type ItemStatus = 'ACTIVE' | 'USED' | 'WASTED'

export type ExpiryStatus = 'EXPIRED' | 'URGENT' | 'SOON' | 'FRESH'

export type ItemResponse = {
  id: string
  name: string
  category: Category
  quantity: number
  unit: string
  // Date only, e.g. "2026-11-12".
  expiryDate: string
  expiryStatus: ExpiryStatus
  // Negative after the expiry date.
  daysLeft: number
  status: ItemStatus
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export type ItemRequest = {
  name: string
  category: Category
  quantity: number
  unit: string
  expiryDate: string
}

export type UserSettings = {
  reminderEnabled: boolean
}

export type ProblemDetail = {
  type?: string
  title: string
  status: number
  detail?: string
  errors?: Record<string, string>
}
