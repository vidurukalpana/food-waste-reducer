export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-forest-light disabled:opacity-60'

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-forest/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest/40 disabled:opacity-60'

export const labelClass = 'text-sm font-medium text-forest'

export function inputClass(hasError: boolean): string {
  const border = hasError ? 'border-expired' : 'border-forest/15'
  return `rounded-xl border bg-white px-4 py-2.5 text-forest outline-none transition placeholder:text-forest/40 focus:border-sage focus:ring-4 focus:ring-sage/20 ${border}`
}

export const cardClass = 'rounded-2xl bg-white shadow-sm ring-1 ring-forest/5'
