import type { User } from 'firebase/auth'

type Props = {
  user: User
}

export function PaymentMethods({ user }: Props) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Stripe details</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Payout account configured for this signed-in user
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800">
          Successfully configured
        </span>
      </div>

      <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-2 dark:border-emerald-900/50">
          <StripeMark className="h-5 w-5 text-[#635BFF]" />
          <div>
            <p className="text-[11px] font-semibold text-stone-900 dark:text-stone-100">
              Stripe Connect active
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              Verified and ready for job claim payouts
            </p>
          </div>
        </div>

        <dl className="mt-2 grid gap-2 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Account email</dt>
            <dd className="max-w-[190px] truncate font-medium text-stone-800 dark:text-stone-200">
              {user.email}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Stripe account</dt>
            <dd className="font-mono font-medium text-stone-800 dark:text-stone-200">acct_****7392</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Payout method</dt>
            <dd className="font-medium text-stone-800 dark:text-stone-200">Bank ending 4821</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone-500 dark:text-stone-400">Payout status</dt>
            <dd className="font-medium text-emerald-800 dark:text-emerald-300">Enabled</dd>
          </div>
        </dl>
      </div>
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
