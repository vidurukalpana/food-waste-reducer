import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'
import { getSettings, settingsQueryKey, updateSettings } from '../api/settings'
import { Alert } from '../components/Alert'
import { PageHeader } from '../components/PageHeader'
import { cardClass } from '../components/styles'

type SwitchProps = {
  checked: boolean
  disabled: boolean
  labelledBy: string
  describedBy: string
  onChange: (checked: boolean) => void
}

function Switch({ checked, disabled, labelledBy, describedBy, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage/30 disabled:opacity-60 ${
        checked ? 'bg-sage' : 'bg-forest/20'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block size-5 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export function SettingsPage() {
  const queryClient = useQueryClient()
  const labelId = useId()
  const descriptionId = useId()
  const settingsQuery = useQuery({ queryKey: settingsQueryKey, queryFn: getSettings })
  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (settings) => queryClient.setQueryData(settingsQueryKey, settings),
  })

  return (
    <div>
      <PageHeader title="Settings" subtitle="Choose how the app keeps in touch." />

      {settingsQuery.isPending && <p className="text-forest/60">Loading settings…</p>}
      {settingsQuery.isError && (
        <Alert>Could not load settings: {settingsQuery.error.message}</Alert>
      )}
      {settingsQuery.isSuccess && (
        <section className={`${cardClass} max-w-2xl p-6`}>
          {updateMutation.isError && (
            <Alert className="mb-4">Could not save: {updateMutation.error.message}</Alert>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={labelId} className="font-semibold">
                Daily email reminder
              </h2>
              <p id={descriptionId} className="mt-1 text-sm text-forest/70">
                An email at 7:00 AM when food is about to expire. Each item is mentioned once.
              </p>
            </div>
            <Switch
              checked={settingsQuery.data.reminderEnabled}
              disabled={updateMutation.isPending}
              labelledBy={labelId}
              describedBy={descriptionId}
              onChange={(reminderEnabled) => updateMutation.mutate({ reminderEnabled })}
            />
          </div>
        </section>
      )}
    </div>
  )
}
