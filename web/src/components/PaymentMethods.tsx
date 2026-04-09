import { useState } from 'react'
import type { User } from 'firebase/auth'

type Props = {
  user: User
}

const REFUSALS = [
  'Your card was declined. Use another card or contact your bank.',
  'Stripe could not verify this payment method. Setup was not completed.',
  'Bank authentication (3D Secure) did not finish in time. Try again.',
  'This payment method is not eligible for setup. Error code: card_declined_rate_limit.',
  'We could not attach a payment method to your profile. Processor returned: setup_intent_unexpected_state.',
  'Your issuer refused the authorization. No charges were made.',
]

export function PaymentMethods({ user }: Props) {
  const [step, setStep] = useState<'prompt' | 'form'>('prompt')
  const [busy, setBusy] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  function startSetup() {
    setStep('form')
    setError(null)
    setCardNumber('')
    setExpiry('')
    setCvc('')
  }

  function submitSetup(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    window.setTimeout(() => {
      const msg = REFUSALS[attempt % REFUSALS.length]
      setError(msg)
      setAttempt((a) => a + 1)
      setBusy(false)
    }, 1400)
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Billing</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Card processing via Stripe · required before matter billing
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800">
          Not connected
        </span>
      </div>

      {step === 'prompt' ? (
        <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50/90 p-3 dark:border-stone-600 dark:bg-stone-950/40">
          <p className="text-xs text-stone-700 dark:text-stone-300">
            Add a payment method through Stripe to cover filing and review fees. You will not be charged
            until services are rendered.
          </p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
            Billing contact: <span className="font-medium text-stone-700 dark:text-stone-300">{user.email}</span>
          </p>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#635BFF] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5851e6] dark:bg-[#635BFF] dark:hover:bg-[#7a73ff]"
            onClick={startSetup}
          >
            <StripeMark className="h-4 w-4 text-white" />
            Set up billing with Stripe
          </button>
          <p className="mt-2 text-center text-[10px] text-stone-400 dark:text-stone-500">
            You will be asked to enter card details on the next step.
          </p>
        </div>
      ) : (
        <form className="mt-3 space-y-2" onSubmit={submitSetup}>
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2 dark:border-stone-700">
            <div className="flex items-center gap-2">
              <StripeMark className="h-5 w-5 text-[#635BFF]" />
              <div>
                <p className="text-[11px] font-semibold text-stone-900 dark:text-stone-100">Stripe setup</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">Secure card capture (simulated)</p>
              </div>
            </div>
            <button
              type="button"
              className="text-[10px] font-medium text-stone-500 underline-offset-2 hover:text-stone-700 hover:underline dark:hover:text-stone-300"
              onClick={() => {
                setStep('prompt')
                setError(null)
              }}
            >
              Cancel
            </button>
          </div>

          <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300">
            Card number
            <input
              required
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 font-mono text-xs text-stone-900 outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] font-medium text-stone-600 dark:text-stone-300">
              Expiry
              <input
                required
                autoComplete="cc-exp"
                placeholder="MM / YY"
                className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </label>
            <label className="text-[11px] font-medium text-stone-600 dark:text-stone-300">
              CVC
              <input
                required
                autoComplete="cc-csc"
                placeholder="123"
                className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </label>
          </div>

          {error ? (
            <div
              className="rounded border border-red-200 bg-red-50 px-2 py-2 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              <p className="font-medium">Setup refused</p>
              <p className="mt-0.5 text-[11px] leading-snug opacity-95">{error}</p>
              <p className="mt-1.5 text-[10px] text-red-800/80 dark:text-red-300/80">
                Attempt {attempt} · If this continues, contact support or use another card.
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-[#635BFF] py-2 text-xs font-semibold text-white hover:bg-[#5851e6] disabled:opacity-60 dark:hover:bg-[#7a73ff]"
          >
            {busy ? 'Contacting Stripe…' : 'Complete setup'}
          </button>
          <p className="text-center text-[10px] text-stone-400 dark:text-stone-500">
            Payments processed by Stripe · Meridian Compliance Services
          </p>
        </form>
      )}
    </section>
  )
}

function StripeMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.724 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  )
}
