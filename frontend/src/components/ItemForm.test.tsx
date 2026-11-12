import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ItemForm } from './ItemForm'

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  render(
    <MemoryRouter>
      <ItemForm
        defaultValues={{ quantity: '1', unit: 'pcs' }}
        submitLabel="Save"
        onSubmit={onSubmit}
      />
    </MemoryRouter>,
  )
  return onSubmit
}

describe('ItemForm', () => {
  it('shows field errors without submitting an empty form', async () => {
    const onSubmit = renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Category is required')).toBeInTheDocument()
    expect(screen.getByText('Expiry date is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a valid item as an API request', async () => {
    const onSubmit = renderForm()

    await userEvent.type(screen.getByLabelText('Name'), '  Yoghurt  ')
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'DAIRY')
    await userEvent.clear(screen.getByLabelText('Quantity'))
    await userEvent.type(screen.getByLabelText('Quantity'), '2.5')
    // Date inputs do not take typed text in jsdom.
    fireEvent.change(screen.getByLabelText('Expiry date'), { target: { value: '2026-11-20' } })
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Yoghurt',
      category: 'DAIRY',
      quantity: 2.5,
      unit: 'pcs',
      expiryDate: '2026-11-20',
    })
  })
})
