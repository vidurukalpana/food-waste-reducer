import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'

type Health = { status: string }

// A slow first reply means the server is waking up.
const WAKING_DELAY_MS = 3000

export function ApiStatus() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<Health>('/actuator/health'),
  })
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    if (!isPending) {
      return
    }
    const timer = setTimeout(() => setIsSlow(true), WAKING_DELAY_MS)
    return () => clearTimeout(timer)
  }, [isPending])

  let label: string
  if (isPending) {
    label = isSlow ? 'Waking server…' : 'API: checking…'
  } else if (isError) {
    label = 'API: unavailable'
  } else {
    label = `API: ${data.status}`
  }

  return (
    <span role="status" className="text-sm text-gray-600">
      {label}
    </span>
  )
}
