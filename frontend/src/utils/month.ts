// Months are "YYYY-MM" strings in Sri Lanka time.

const yearMonthFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Colombo',
  year: 'numeric',
  month: '2-digit',
})

const monthLabelFormat = new Intl.DateTimeFormat('en-LK', {
  timeZone: 'Asia/Colombo',
  month: 'long',
  year: 'numeric',
})

export function currentMonth(): string {
  return yearMonthFormat.format(new Date())
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthNumber] = month.split('-').map(Number)
  const index = year * 12 + (monthNumber - 1) + delta
  const newYear = Math.floor(index / 12)
  const newMonth = (index % 12) + 1
  return `${newYear}-${String(newMonth).padStart(2, '0')}`
}

// "2026-11" becomes "November 2026".
export function formatMonth(month: string): string {
  return monthLabelFormat.format(new Date(`${month}-15T12:00:00+05:30`))
}
