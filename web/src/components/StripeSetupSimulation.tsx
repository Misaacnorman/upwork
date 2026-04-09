import { useState } from 'react'

type Phase = 'intro' | 'details' | 'ursb' | 'linking' | 'failed'

const STRIPE_ERROR_BUSINESS_NOT_FOUND =
  'Business not found. No matching registered entity was returned from URSB for the details provided.'
const STRIPE_ERROR_OWNERSHIP =
  'Cannot confirm ownership. Stripe was unable to verify authorized signatories for this business profile.'

export function StripeSetupSimulation() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [failMessage, setFailMessage] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [location, setLocation] = useState('')
  const [poBox, setPoBox] = useState('')
  const [progress, setProgress] = useState(0)

  function start() {
    setPhase('details')
    setBusinessName('')
    setLocation('')
    setPoBox('')
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault()
    if (!businessName.trim() || !location.trim() || !poBox.trim()) return
    setPhase('ursb')
    setProgress(0)

    const ursbChecks = [12, 33, 58, 83, 100]
    let idx = 0
    const tickUrsb = () => {
      if (idx < ursbChecks.length) {
        setProgress(ursbChecks[idx]!)
        idx++
        window.setTimeout(tickUrsb, 320)
        return
      }
      setPhase('linking')
      setProgress(0)
      const stripeChecks = [16, 39, 66, 88, 100]
      let s = 0
      const tickStripe = () => {
        if (s < stripeChecks.length) {
          setProgress(stripeChecks[s]!)
          s++
          window.setTimeout(tickStripe, 350)
          return
        }
        window.setTimeout(() => {
          setFailMessage(
            Math.random() < 0.5 ? STRIPE_ERROR_BUSINESS_NOT_FOUND : STRIPE_ERROR_OWNERSHIP
          )
          setPhase('failed')
        }, 350)
      }
      window.setTimeout(tickStripe, 220)
    }
    window.setTimeout(tickUrsb, 200)
  }

  function reset() {
    setPhase('intro')
    setProgress(0)
    setFailMessage('')
  }

  return (
    <section className="rounded-lg border border-[#635BFF]/25 bg-white p-3 text-left shadow-sm dark:border-[#635BFF]/30 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Stripe onboarding</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Complete business verification before activating card collections.
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Setup required
        </span>
      </div>

      {phase === 'intro' ? (
        <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50/80 p-3 dark:border-stone-600 dark:bg-stone-950/50">
          <p className="text-xs text-stone-700 dark:text-stone-300">
            Submit your registered business profile so we can validate URSB details before creating a
            Stripe account for payouts and billing collections.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-md border border-[#635BFF] bg-[#635BFF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#5851e6] dark:hover:bg-[#7a73ff]"
            onClick={start}
          >
            Start Stripe setup
          </button>
        </div>
      ) : null}

      {phase === 'details' ? (
        <form className="mt-3 space-y-2" onSubmit={submitDetails}>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">Step 1 of 3 — Business details</p>
          <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300">
            Registered business name
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>
          <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300">
            Business location
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>
          <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300">
            Post office box number
            <input
              required
              value={poBox}
              onChange={(e) => setPoBox(e.target.value)}
              className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="rounded-md bg-[#635BFF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#5851e6]"
            >
              Verify and continue
            </button>
            <button
              type="button"
              className="rounded border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
              onClick={reset}
            >
              Back
            </button>
          </div>
        </form>
      ) : null}

      {phase === 'ursb' ? (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
            Step 2 of 3 — URSB verification
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Looking up registered business details in URSB database…
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-full rounded-full bg-[#635BFF] transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
            query={businessName.toUpperCase()} · ref=URSB-{poBox.replace(/\s+/g, '')}
          </p>
        </div>
      ) : null}

      {phase === 'linking' ? (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
            Step 3 of 3 — Stripe account activation
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">Opening secure onboarding session…</p>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-full rounded-full bg-[#635BFF] transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
            account=acct_••••pending · provider=stripe_connect
          </p>
        </div>
      ) : null}

      {phase === 'failed' ? (
        <div className="mt-3 rounded border border-red-200 bg-red-50 px-2 py-2 dark:border-red-900/50 dark:bg-red-950/40">
          <p className="text-xs font-semibold text-red-900 dark:text-red-200">Setup did not complete</p>
          <p className="mt-1 text-[11px] leading-snug text-red-800 dark:text-red-300/95">
            {failMessage}
          </p>
          <button
            type="button"
            className="mt-2 text-[11px] font-medium text-red-900 underline underline-offset-2 hover:no-underline dark:text-red-200"
            onClick={reset}
          >
            Retry setup
          </button>
        </div>
      ) : null}
    </section>
  )
}
