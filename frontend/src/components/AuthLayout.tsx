import type { ReactNode } from 'react'
import { Brand } from './Brand'

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="relative overflow-hidden bg-forest px-6 pb-24 pt-8 text-white lg:flex lg:flex-col lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-72 rounded-full bg-sage/30"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-16 hidden size-56 rounded-full bg-ochre/40 lg:block"
        />
        <div aria-hidden="true" className="absolute right-10 top-36 size-6 rounded-full bg-sun" />

        <div className="relative flex justify-center lg:justify-start">
          <Brand />
        </div>

        {/* my-auto centres the tagline in the space below the brand. */}
        <div className="relative mx-auto mt-10 max-w-lg text-center lg:my-auto">
          <h2 className="font-display text-4xl leading-tight lg:text-6xl">
            Fresh Meals with Less Waste.
          </h2>
          <p className="mt-4 hidden text-white/75 sm:block">
            Track the food in your kitchen. See what to use first.
          </p>
        </div>
      </section>

      <section className="relative -mt-14 px-4 pb-10 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:p-12">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl shadow-forest/10 sm:p-8">
          <h1 className="font-display text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-forest/70">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  )
}
