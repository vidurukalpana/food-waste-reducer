import type { ExpiryStatus } from '../api/types'

type ExpiryStyle = {
  label: string
  range: string
  dot: string
  text: string
  badge: string
  tile: string
}

// Colours follow the expiry status rules table: red, orange, yellow, green.
export const expiryStyles: Record<ExpiryStatus, ExpiryStyle> = {
  EXPIRED: {
    label: 'Expired',
    range: 'Past the date',
    dot: 'bg-expired',
    text: 'text-expired',
    badge: 'bg-expired text-white',
    tile: 'bg-expired text-white',
  },
  URGENT: {
    label: 'Urgent',
    range: '0–2 days',
    dot: 'bg-urgent',
    text: 'text-urgent',
    badge: 'bg-urgent text-white',
    tile: 'bg-urgent text-white',
  },
  SOON: {
    label: 'Soon',
    range: '3–7 days',
    dot: 'bg-soon',
    text: 'text-soon-ink',
    badge: 'bg-soon text-forest',
    tile: 'bg-soon text-forest',
  },
  FRESH: {
    label: 'Fresh',
    range: 'Over 7 days',
    dot: 'bg-fresh',
    text: 'text-fresh-ink',
    badge: 'bg-sage-light text-forest',
    tile: 'bg-fresh text-white',
  },
}

export const expiryStatusOrder: ExpiryStatus[] = ['EXPIRED', 'URGENT', 'SOON', 'FRESH']
