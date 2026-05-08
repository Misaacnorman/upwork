import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, firebaseReady } from './firebase'
import { AuthPanel } from './components/AuthPanel'
import { AptitudeTest } from './components/AptitudeTest'
import { DocumentUpload } from './components/DocumentUpload'
import { JobNumberLookup } from './components/JobNumberLookup'
import { PaymentMethods } from './components/PaymentMethods'

const CLAIM_STATUS_KEY = 'meridian.claim.1380HD74.status'

function readClaimPending() {
  return window.localStorage.getItem(CLAIM_STATUS_KEY) === 'pending'
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(!firebaseReady)
  const [claimPending, setClaimPending] = useState(readClaimPending)

  function markClaimPending() {
    window.localStorage.setItem(CLAIM_STATUS_KEY, 'pending')
    setClaimPending(true)
  }

  useEffect(() => {
    if (!firebaseReady || !auth) return
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-svh bg-[#f4f4f5] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="border-b border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2">
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Meridian Compliance Services
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Worker payouts - Stripe connected - secure client portal
            </p>
          </div>
          {user ? (
            <p className="hidden max-w-[220px] truncate text-right text-[11px] text-stone-500 sm:block dark:text-stone-400">
              {user.email}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-3">
        {!authReady ? (
          <p className="py-8 text-center text-xs text-stone-500">Loading...</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-12 lg:items-start">
            <div className="space-y-3 lg:col-span-4">
              <AuthPanel user={user} onUserChange={setUser} />
              {user ? <PaymentMethods user={user} /> : null}
              {user && claimPending ? (
                <JobNumberLookup claimPending={claimPending} onClaim={markClaimPending} compact />
              ) : null}
            </div>
            <div className="lg:col-span-8">
              {user ? (
                <div className="space-y-3">
                  {claimPending ? (
                    <AptitudeTest />
                  ) : (
                    <>
                      <DocumentUpload user={user} />
                      <JobNumberLookup claimPending={claimPending} onClaim={markClaimPending} />
                    </>
                  )}
                </div>
              ) : (
                <section className="rounded-lg border border-dashed border-stone-300 bg-white/80 p-4 text-center dark:border-stone-600 dark:bg-stone-900/60">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Sign in to view Stripe payout details and claim money attached to a job number.
                  </p>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-stone-200 py-2 text-center text-[11px] text-stone-500 dark:border-stone-800 dark:text-stone-500">
        <p>(c) {new Date().getFullYear()} Meridian Compliance Services. All rights reserved.</p>
        <p className="mt-0.5 text-stone-400 dark:text-stone-600">
          <a className="hover:text-stone-600 dark:hover:text-stone-400" href="#">
            Privacy
          </a>
          <span className="mx-2">-</span>
          <a className="hover:text-stone-600 dark:hover:text-stone-400" href="#">
            Terms
          </a>
          <span className="mx-2">-</span>
          <a className="hover:text-stone-600 dark:hover:text-stone-400" href="#">
            Support
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
