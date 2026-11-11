import type { ExpiryStatus } from '../api/types'

type ExpiryStyle = {
  label: string
  card: string
  badge: string
}

// Colours follow the expiry status rules table.
export const expiryStyles: Record<ExpiryStatus, ExpiryStyle> = {
  EXPIRED: {
    label: 'Expired',
    card: 'border-red-500 bg-red-50',
    badge: 'bg-red-600 text-white',
  },
  URGENT: {
    label: 'Urgent',
    card: 'border-orange-500 bg-orange-50',
    badge: 'bg-orange-500 text-white',
  },
  SOON: {
    label: 'Soon',
    card: 'border-yellow-400 bg-yellow-50',
    badge: 'bg-yellow-300 text-gray-900',
  },
  FRESH: {
    label: 'Fresh',
    card: 'border-green-500 bg-green-50',
    badge: 'bg-green-600 text-white',
  },
}

export const expiryStatusOrder: ExpiryStatus[] = ['EXPIRED', 'URGENT', 'SOON', 'FRESH']
