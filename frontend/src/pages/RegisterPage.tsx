import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { z } from 'zod'
import { apiFetch } from '../api/client'
import { applyServerErrors } from '../api/formErrors'
import type { UserResponse } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { Alert } from '../components/Alert'
import { AuthLayout } from '../components/AuthLayout'
import { primaryButton } from '../components/styles'
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
    <AuthLayout title="Create an account" subtitle="Start tracking the food in your kitchen.">
      {errors.root?.server && <Alert className="mb-4">{errors.root.server.message}</Alert>}

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
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${primaryButton} mt-2 w-full py-3`}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-forest/70">
        Have an account?{' '}
        <Link to="/login" className="font-semibold text-ochre hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
