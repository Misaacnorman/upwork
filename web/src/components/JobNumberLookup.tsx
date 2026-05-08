import { useState } from 'react'

type JobClaim = {
  name: string
  amount?: string
  claimable?: boolean
}

type Props = {
  claimPending: boolean
  onClaim: () => void
  compact?: boolean
}

const JOB_CLAIMS: Record<string, JobClaim> = {
  '1380HD74': { name: 'Kirabo Sheila', amount: 'UGX 523,600', claimable: true },
  '1380HD-74': { name: 'Kirabo Sheila', amount: 'UGX 523,600', claimable: true },
  'MCS-2024-0142': { name: 'Harborview Logistics LLC' },
  'MCS-2025-0088': { name: 'Kirabo Family Trust' },
  'JOB-4401': { name: 'Sterling Capital Advisors' },
  'JOB-7729': { name: 'Northwind Exports, Inc.' },
  '2024-INT-003': { name: 'Internal - Regulatory review queue' },
  'M-99102': { name: 'Acme Compliance Pilot' },
}

function normalizeJobKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '')
}

export function JobNumberLookup({ claimPending, onClaim, compact = false }: Props) {
  const [jobNumber, setJobNumber] = useState(claimPending ? '1380HD74' : '')
  const [status, setStatus] = useState<'idle' | 'searching' | 'done'>(claimPending ? 'done' : 'idle')
  const [claim, setClaim] = useState<JobClaim | null>(claimPending ? JOB_CLAIMS['1380HD74']! : null)

  function search(e: React.FormEvent) {
    e.preventDefault()
    const key = normalizeJobKey(jobNumber)
    if (!key) return

    setStatus('searching')
    setClaim(null)

    const delayMs = 700 + Math.floor(Math.random() * 600)
    window.setTimeout(() => {
      setClaim(JOB_CLAIMS[key] ?? null)
      setStatus('done')
    }, delayMs)
  }

  const normalizedJobNumber = normalizeJobKey(jobNumber)

  if (claimPending && compact) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Job payment</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">Claim submitted for Sheila</p>
          </div>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800">
            Pending
          </span>
        </div>
        <dl className="mt-3 grid gap-2 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Job</dt>
            <dd className="font-mono font-medium text-stone-800 dark:text-stone-200">1380HD74</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Worker</dt>
            <dd className="font-medium text-stone-800 dark:text-stone-200">Kirabo Sheila</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Amount</dt>
            <dd className="font-medium text-stone-800 dark:text-stone-200">UGX 523,600</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Status</dt>
            <dd className="font-medium text-amber-800 dark:text-amber-300">Pending payment</dd>
          </div>
        </dl>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Job claim lookup</h2>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Enter a job number to check whether money is attached to Sheila&apos;s worker profile.
      </p>
      <form className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={search}>
        <label className="min-w-0 flex-1 text-[11px] font-medium text-stone-600 dark:text-stone-300">
          Job number
          <input
            type="text"
            value={jobNumber}
            onChange={(e) => {
              setJobNumber(e.target.value)
              if (status === 'done') {
                setStatus('idle')
                setClaim(null)
              }
            }}
            className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 font-mono text-xs text-stone-900 outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          disabled={status === 'searching' || !jobNumber.trim()}
          className="shrink-0 rounded bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          {status === 'searching' ? 'Searching...' : 'Search'}
        </button>
      </form>

      {status === 'searching' ? (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400" role="status">
          Querying job claim index...
        </p>
      ) : null}

      {status === 'done' && claim ? (
        <>
          <div className="mt-2 rounded border border-emerald-200 bg-emerald-50/90 px-2 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Match
            </p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{claim.name}</p>
            <p className="mt-0.5 text-[11px] text-stone-600 dark:text-stone-400">
              Job <span className="font-mono">{normalizedJobNumber}</span>
            </p>
          </div>

          {claim.claimable ? (
            <div className="mt-2 rounded border border-[#635BFF]/30 bg-[#635BFF]/5 px-2 py-2 dark:border-[#635BFF]/40 dark:bg-[#635BFF]/10">
              {claimPending ? (
                <>
                  <p className="text-xs font-semibold text-stone-950 dark:text-stone-100">
                    Pending payment
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-stone-700 dark:text-stone-300">
                    This claim has already been submitted. The money is pending payment and the claim
                    button cannot be used again.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-stone-950 dark:text-stone-100">
                    Claim available for Sheila
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-stone-700 dark:text-stone-300">
                    This job has money attached to the Sheila worker profile. Claim{' '}
                    {claim.amount ?? 'the available payout'} for job{' '}
                    <span className="font-mono">{normalizedJobNumber}</span> using the configured Stripe
                    account.
                  </p>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-md bg-[#635BFF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#5851e6] dark:hover:bg-[#7a73ff]"
                    onClick={onClaim}
                  >
                    Claim money
                  </button>
                </>
              )}
            </div>
          ) : null}
        </>
      ) : null}

      {status === 'done' && !claim ? (
        <div className="mt-2 rounded border border-amber-200 bg-amber-50/90 px-2 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-xs font-medium text-amber-950 dark:text-amber-200">No claim found</p>
          <p className="mt-0.5 text-[11px] text-amber-900/90 dark:text-amber-300/90">
            No active claim matches <span className="font-mono">{normalizedJobNumber}</span>. Check the
            job number or contact support.
          </p>
        </div>
      ) : null}
    </section>
  )
}
