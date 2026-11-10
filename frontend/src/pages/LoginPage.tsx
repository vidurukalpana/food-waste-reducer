import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { apiFetch } from '../api/client'
import { applyServerErrors } from '../api/formErrors'
import type { LoginResponse } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { TextField } from '../components/TextField'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

type LoginLocationState = { from?: string; registered?: boolean } | null

export function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values: LoginForm) => {
    try {
      const response = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      login(response.token)
      navigate(state?.from ?? '/dashboard', { replace: true })
    } catch (error) {
      applyServerErrors(error, setError, ['email', 'password'])
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Log in</h1>

      {state?.registered && (
        <p role="status" className="mb-4 rounded border border-green-600 bg-green-50 p-3 text-sm">
          Account created. Log in to continue.
        </p>
      )}
      {errors.root?.server && (
        <p role="alert" className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-sm">
          {errors.root.server.message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-gray-800 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        No account?{' '}
        <Link to="/register" className="font-semibold underline">
          Register
        </Link>
      </p>
    </div>
  )
}
