import type { ReactNode } from 'react'

type AlertProps = {
  tone?: 'error' | 'success'
  className?: string
  children: ReactNode
}

const toneClasses = {
  error: 'border-expired/30 bg-expired/10 text-expired',
  success: 'border-sage/40 bg-sage-light text-forest',
}

export function Alert({ tone = 'error', className = '', children }: AlertProps) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </p>
  )
}
