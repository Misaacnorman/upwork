import { useState } from 'react'

/** Simulated matter registry — extend or replace with API later. */
const MATTER_NAMES: Record<string, string> = {
  'MCS-2024-0142': 'Harborview Logistics LLC',
  'MCS-2025-0088': 'Kirabo Family Trust',
  'JOB-4401': 'Sterling Capital Advisors',
  'JOB-7729': 'Northwind Exports, Inc.',
  '2024-INT-003': 'Internal — Regulatory review queue',
  'M-99102': 'Acme Compliance Pilot',
  '1380HD74': 'Kirabo Sheilla',
}

function normalizeJobKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '')
}

export function JobNumberLookup() {
  const [jobNumber, setJobNumber] = useState('')
  const [status, setStatus] = useState<'idle' | 'searching' | 'done'>('idle')
  const [resolvedName, setResolvedName] = useState<string | null>(null)

  function search(e: React.FormEvent) {
    e.preventDefault()
    const key = normalizeJobKey(jobNumber)
    if (!key) return

    setStatus('searching')
    setResolvedName(null)

    const delayMs = 700 + Math.floor(Math.random() * 600)
    window.setTimeout(() => {
      const name = MATTER_NAMES[key] ?? null
      setResolvedName(name)
      setStatus('done')
    }, delayMs)
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Matter lookup</h2>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Enter a job or matter number to confirm worker&apos;s name.
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
                setResolvedName(null)
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
          {status === 'searching' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'searching' ? (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400" role="status">
          Querying matter index…
        </p>
      ) : null}

      {status === 'done' && resolvedName ? (
        <>
          <div className="mt-2 rounded border border-emerald-200 bg-emerald-50/90 px-2 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Match
            </p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{resolvedName}</p>
            <p className="mt-0.5 text-[11px] text-stone-600 dark:text-stone-400">
              Job <span className="font-mono">{normalizeJobKey(jobNumber)}</span>
            </p>
          </div>
          {normalizeJobKey(jobNumber) === '1380HD74' ? (
            <div className="mt-2 rounded border border-amber-200 bg-amber-50/90 px-2 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-xs font-medium text-amber-950 dark:text-amber-200">User account not found</p>
              <p className="mt-0.5 text-[11px] text-amber-900/90 dark:text-amber-300/90">
                No user account is found for this worker. Complete payment setup to continue.
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      {status === 'done' && !resolvedName ? (
        <div className="mt-2 rounded border border-amber-200 bg-amber-50/90 px-2 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-xs font-medium text-amber-950 dark:text-amber-200">No record found</p>
          <p className="mt-0.5 text-[11px] text-amber-900/90 dark:text-amber-300/90">
            No active matter matches <span className="font-mono">{normalizeJobKey(jobNumber)}</span>. Check
            the number or contact intake.
          </p>
        </div>
      ) : null}
    </section>
  )
}
