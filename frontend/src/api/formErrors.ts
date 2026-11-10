import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from './client'

// Backend field errors go under their inputs. Any other failure becomes one form-level message.
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): void {
  if (!(error instanceof ApiError)) {
    setError('root.server', { message: 'Could not reach the server. Try again.' })
    return
  }

  let matchedField = false
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const formField = fields.find((name) => name === field)
    if (formField) {
      setError(formField, { message })
      matchedField = true
    }
  }
  if (!matchedField) {
    setError('root.server', { message: error.message })
  }
}
