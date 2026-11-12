import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { ExpiryStatus, ItemResponse } from '../api/types'
import { ItemCard } from './ItemCard'

function item(expiryStatus: ExpiryStatus, daysLeft: number): ItemResponse {
  return {
    id: 'item-1',
    name: 'Milk',
    category: 'DAIRY',
    quantity: 1,
    unit: 'l',
    expiryDate: '2026-11-12',
    expiryStatus,
    daysLeft,
    status: 'ACTIVE',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    closedAt: null,
  }
}

describe('ItemCard', () => {
  // Colours follow the rules table: red, orange, yellow, green.
  it.each([
    {
      status: 'EXPIRED',
      daysLeft: -1,
      badge: 'Expired',
      colour: 'bg-expired',
      text: 'Expired 1 day ago',
    },
    { status: 'URGENT', daysLeft: 0, badge: 'Urgent', colour: 'bg-urgent', text: 'Expires today' },
    { status: 'SOON', daysLeft: 5, badge: 'Soon', colour: 'bg-soon', text: '5 days left' },
    {
      status: 'FRESH',
      daysLeft: 10,
      badge: 'Fresh',
      colour: 'bg-sage-light',
      text: '10 days left',
    },
  ] as const)('shows $status in its colour', ({ status, daysLeft, badge, colour, text }) => {
    render(
      <MemoryRouter>
        <ItemCard
          item={item(status, daysLeft)}
          disabled={false}
          onUsed={vi.fn()}
          onWasted={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(badge)).toHaveClass(colour)
    expect(screen.getByText(text)).toBeInTheDocument()
  })
})
