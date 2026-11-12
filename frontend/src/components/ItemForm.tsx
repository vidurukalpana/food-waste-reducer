import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import { applyServerErrors } from '../api/formErrors'
import type { Category, ItemRequest } from '../api/types'
import { categoryEmoji, formatCategory } from '../utils/format'
import { Alert } from './Alert'
import { cardClass, inputClass, labelClass, primaryButton, secondaryButton } from './styles'
import { TextField } from './TextField'

const categories = [
  'DAIRY',
  'MEAT',
  'SEAFOOD',
  'VEGETABLES',
  'FRUITS',
  'BAKERY',
  'PANTRY',
  'FROZEN',
  'OTHER',
] as const satisfies readonly Category[]

const unitSuggestions = ['pcs', 'g', 'kg', 'ml', 'l', 'pack']

// Same rules as the backend ItemRequest. Inputs hold text; submit converts the values.
const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name must be at most 120 characters'),
  category: z.enum(categories, { error: 'Category is required' }),
  quantity: z
    .string()
    .trim()
    .min(1, 'Quantity is required')
    .regex(/^\d{1,8}(\.\d{1,2})?$/, 'Quantity is too large or has more than 2 decimals')
    .refine((value) => Number(value) > 0, 'Quantity must be greater than 0'),
  unit: z.string().trim().min(1, 'Unit is required').max(20, 'Unit must be at most 20 characters'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
})

export type ItemFormValues = z.infer<typeof itemSchema>

const formFields = ['name', 'category', 'quantity', 'unit', 'expiryDate'] as const

function toItemRequest(values: ItemFormValues): ItemRequest {
  return {
    name: values.name,
    category: values.category,
    quantity: Number(values.quantity),
    unit: values.unit,
    expiryDate: values.expiryDate,
  }
}

type ItemFormProps = {
  defaultValues: Partial<ItemFormValues>
  submitLabel: string
  onSubmit: (request: ItemRequest) => Promise<void>
}

export function ItemForm({ defaultValues, submitLabel, onSubmit }: ItemFormProps) {
  const categoryId = useId()
  const unitListId = useId()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { category: undefined, ...defaultValues },
  })

  const submit = async (values: ItemFormValues) => {
    try {
      await onSubmit(toItemRequest(values))
    } catch (error) {
      applyServerErrors(error, setError, formFields)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className={`${cardClass} flex max-w-2xl flex-col gap-5 p-6 sm:p-8`}
    >
      {errors.root?.server && <Alert>{errors.root.server.message}</Alert>}

      <TextField label="Name" error={errors.name?.message} {...register('name')} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={categoryId} className={labelClass}>
          Category
        </label>
        <select
          id={categoryId}
          aria-invalid={errors.category ? true : undefined}
          className={inputClass(Boolean(errors.category))}
          {...register('category')}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryEmoji(category)} {formatCategory(category)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-sm text-expired">{errors.category.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Quantity"
          inputMode="decimal"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <TextField
          label="Unit"
          list={unitListId}
          error={errors.unit?.message}
          {...register('unit')}
        />
        <TextField
          label="Expiry date"
          type="date"
          error={errors.expiryDate?.message}
          {...register('expiryDate')}
        />
      </div>
      <datalist id={unitListId}>
        {unitSuggestions.map((unit) => (
          <option key={unit} value={unit} />
        ))}
      </datalist>

      <div className="mt-2 flex flex-wrap gap-3 border-t border-forest/10 pt-5">
        <button type="submit" disabled={isSubmitting} className={primaryButton}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        <Link to="/items" className={secondaryButton}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
