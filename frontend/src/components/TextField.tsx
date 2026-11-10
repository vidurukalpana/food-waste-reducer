import { useId, type ComponentProps } from 'react'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`rounded border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-400'}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
