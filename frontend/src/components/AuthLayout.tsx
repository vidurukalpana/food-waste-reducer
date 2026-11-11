import type { ReactNode } from 'react'
import { expiryStatusOrder, expiryStyles } from '../utils/expiryStyles'
import { Brand } from './Brand'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="relative overflow-hidden bg-forest px-6 pb-24 pt-8 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-72 rounded-full bg-sage/30"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-16 hidden size-56 rounded-full bg-ochre/40 lg:block"
        />
        <div aria-hidden="true" className="absolute right-10 top-36 size-6 rounded-full bg-sun" />

        <div className="relative">
          <Brand />
        </div>

        <div className="relative mt-10 max-w-md lg:mt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sun">
            Eat it before it expires
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight lg:text-6xl">
            Less waste. Fresher meals.
          </h2>
          <p className="mt-4 hidden text-white/75 sm:block">
            Track the food in your kitchen. See what to use first. Throw away less every month.
          </p>
        </div>

        <ul className="relative hidden flex-wrap gap-2 lg:flex">
          {expiryStatusOrder.map((status) => (
            <li
              key={status}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm"
            >
              <span className={`size-2.5 rounded-full ${expiryStyles[status].dot}`} />
              {expiryStyles[status].label}
            </li>
          ))}
        </ul>
      </section>

      <section className="relative -mt-14 px-4 pb-10 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:p-12">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl shadow-forest/10 sm:p-8">
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-forest/70">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  )
}
