import { useId, type ComponentProps } from 'react'
import { inputClass, labelClass } from './styles'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(Boolean(error))}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-expired">
          {error}
        </p>
      )}
    </div>
  )
}
