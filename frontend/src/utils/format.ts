import type { Category } from '../api/types'

const dateFormat = new Intl.DateTimeFormat('en-LK', {
  timeZone: 'Asia/Colombo',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const quantityFormat = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 2 })

// Input is a date-only string such as "2026-11-12".
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(`${isoDate}T00:00:00+05:30`))
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantityFormat.format(quantity)} ${unit}`
}

const categoryLabels: Record<Category, string> = {
  DAIRY: 'Dairy',
  MEAT: 'Meat',
  SEAFOOD: 'Seafood',
  VEGETABLES: 'Vegetables',
  FRUITS: 'Fruits',
  BAKERY: 'Bakery',
  PANTRY: 'Pantry',
  FROZEN: 'Frozen',
  OTHER: 'Other',
}

export function formatCategory(category: Category): string {
  return categoryLabels[category]
}
