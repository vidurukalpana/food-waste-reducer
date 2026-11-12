import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiFetch } from '../api/client'
import { AuthProvider } from './AuthProvider'
import { ProtectedRoute } from './ProtectedRoute'
import { tokenStorage } from './tokenStorage'

// Mocks apiFetch only. ApiError keeps its real class.
vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  apiFetch: vi.fn(),
}))

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<p>Login page</p>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/items" element={<p>My items</p>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset()
  })

  it('sends a visitor without a token to the login page', () => {
    renderAt('/items')

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('My items')).not.toBeInTheDocument()
  })

  it('shows the page to a logged-in user', async () => {
    tokenStorage.set('valid-token')
    vi.mocked(apiFetch).mockResolvedValue({ id: 'user-1', email: 'amal@example.com' })

    renderAt('/items')

    expect(await screen.findByText('My items')).toBeInTheDocument()
  })

  it('logs out a user whose token the API rejects', async () => {
    tokenStorage.set('expired-token')
    vi.mocked(apiFetch).mockRejectedValue(new ApiError(401, 'Authentication required'))

    renderAt('/items')

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(tokenStorage.get()).toBeNull()
  })
})
