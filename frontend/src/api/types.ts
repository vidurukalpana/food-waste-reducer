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

export type ProblemDetail = {
  type?: string
  title: string
  status: number
  detail?: string
  errors?: Record<string, string>
}
