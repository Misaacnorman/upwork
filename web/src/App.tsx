import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, firebaseReady } from './firebase'
import { AuthPanel } from './components/AuthPanel'
import { DocumentUpload } from './components/DocumentUpload'
import { PaymentMethods } from './components/PaymentMethods'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(!firebaseReady)

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setAuthReady(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-svh bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              Fictional brand
            </p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Meridian Document Services
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-stone-500 dark:text-stone-400 sm:block">
            Secure submissions, cloud storage, and saved billing for your filings.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {!authReady ? (
          <p className="text-center text-stone-500 dark:text-stone-400">Loading…</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <AuthPanel user={user} onUserChange={setUser} />
            </div>
            <div className="space-y-8 lg:col-span-2">
              {user ? (
                <>
                  <DocumentUpload user={user} />
                  <PaymentMethods user={user} />
                </>
              ) : (
                <section className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center dark:border-stone-600 dark:bg-stone-900/40">
                  <p className="text-stone-600 dark:text-stone-400">
                    Sign in to upload a Word document and add a payment method.
                  </p>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500 dark:border-stone-800 dark:text-stone-500">
        <p>
          © {new Date().getFullYear()} Meridian Document Services — demo UI only.
        </p>
        <p className="mt-2 text-xs text-stone-400 dark:text-stone-600">
          Firebase project <code className="rounded bg-stone-200/80 px-1 dark:bg-stone-800">upwork-b253c</code>
          {' · '}
          <a
            className="text-teal-700 underline dark:text-teal-500"
            href="https://console.firebase.google.com/project/upwork-b253c/apphosting"
            target="_blank"
            rel="noreferrer"
          >
            App Hosting
          </a>
          {' · '}
          <a
            className="text-teal-700 underline dark:text-teal-500"
            href="https://github.com/Misaacnorman/upwork"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
