import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLeftIcon } from './icons'

type PageHeaderProps = {
  title: string
  subtitle?: string
  back?: { to: string; label: string }
  action?: ReactNode
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {back && (
        <Link
          to={back.to}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest/70 hover:text-forest"
        >
          <ArrowLeftIcon className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-forest/70">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}
