import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { z } from 'zod'
import { apiFetch } from '../api/client'
import { applyServerErrors } from '../api/formErrors'
import type { UserResponse } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { TextField } from '../components/TextField'

const PASSWORD_LENGTH = 'Password must be 8 to 72 characters'

// Same rules as the backend RegisterRequest.
const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters')
    .pipe(z.email('Email must be valid')),
  password: z.string().min(8, PASSWORD_LENGTH).max(72, PASSWORD_LENGTH),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values: RegisterForm) => {
    try {
      await apiFetch<UserResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      navigate('/login', { state: { registered: true } })
    } catch (error) {
      applyServerErrors(error, setError, ['email', 'password'])
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-gray-800 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Have an account?{' '}
        <Link to="/login" className="font-semibold underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
