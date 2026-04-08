import { useState } from 'react'
import type { User } from 'firebase/auth'

type Props = {
  user: User
}

export function PaymentMethods({ user }: Props) {
  const [showReplace, setShowReplace] = useState(false)
  const [fakeBusy, setFakeBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function fakeSave(e: React.FormEvent) {
    e.preventDefault()
    setFakeBusy(true)
    setToast(null)
    window.setTimeout(() => {
      setFakeBusy(false)
      setShowReplace(false)
      setToast('Payment method verified and saved.')
      window.setTimeout(() => setToast(null), 4000)
    }, 900)
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Billing</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Default card on file · charges post after document review
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Active
        </span>
      </div>

      <div className="mt-3 flex gap-3 rounded-md border border-stone-200 bg-stone-50/80 p-3 dark:border-stone-600 dark:bg-stone-950/50">
        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-[#635BFF] text-[10px] font-bold tracking-tight text-white">
          VISA
        </div>
        <div className="min-w-0 flex-1 text-xs">
          <p className="font-medium text-stone-900 dark:text-stone-100">Visa ending in 4242</p>
          <p className="text-stone-500 dark:text-stone-400">Expires 12/2028 · {user.email ?? 'Billing email on file'}</p>
          <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
            Processor: Stripe · ID pm_••••8Kx2q
          </p>
        </div>
      </div>

      {toast ? (
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400" role="status">
          {toast}
        </p>
      ) : null}

      {!showReplace ? (
        <button
          type="button"
          className="mt-3 text-xs font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
          onClick={() => setShowReplace(true)}
        >
          Replace card on file
        </button>
      ) : (
        <form className="mt-3 space-y-2 border-t border-stone-200 pt-3 dark:border-stone-700" onSubmit={fakeSave}>
          <p className="text-[11px] font-medium text-stone-600 dark:text-stone-300">New card (preview)</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="col-span-2 text-[11px] text-stone-600 dark:text-stone-400">
              Card number
              <input
                readOnly
                className="mt-0.5 w-full rounded border border-stone-200 bg-white px-2 py-1.5 font-mono text-xs text-stone-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
                value="4242 4242 4242 4242"
              />
            </label>
            <label className="text-[11px] text-stone-600 dark:text-stone-400">
              Expiry
              <input
                readOnly
                className="mt-0.5 w-full rounded border border-stone-200 bg-white px-2 py-1.5 font-mono text-xs dark:border-stone-600 dark:bg-stone-900"
                value="12 / 28"
              />
            </label>
            <label className="text-[11px] text-stone-600 dark:text-stone-400">
              CVC
              <input
                readOnly
                className="mt-0.5 w-full rounded border border-stone-200 bg-white px-2 py-1.5 font-mono text-xs dark:border-stone-600 dark:bg-stone-900"
                value="•••"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={fakeBusy}
              className="rounded bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              {fakeBusy ? 'Verifying…' : 'Save & replace'}
            </button>
            <button
              type="button"
              className="rounded border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
              onClick={() => setShowReplace(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
