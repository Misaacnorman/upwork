import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, firebaseReady } from '../firebase'

type Props = {
  user: User | null
  onUserChange: (u: User | null) => void
}

export function AuthPanel({ user, onUserChange }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const a = auth
  if (!firebaseReady || !a) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-left text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Firebase not configured
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Copy <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">web/.env.example</code> to{' '}
          <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">web/.env</code> and add your
          web app keys from the Firebase console (project owned by{' '}
          <span className="whitespace-nowrap">isaacnorman.mwine@gmail.com</span>).
        </p>
      </section>
    )
  }

  if (user) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Signed in
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{user.email}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          onClick={async () => {
            setBusy(true)
            try {
              await signOut(a)
              onUserChange(null)
            } finally {
              setBusy(false)
            }
          }}
          disabled={busy}
        >
          Sign out
        </button>
      </section>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const authInstance = a
    if (!authInstance) return
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(authInstance, email, password)
        onUserChange(cred.user)
      } else {
        const cred = await signInWithEmailAndPassword(authInstance, email, password)
        onUserChange(cred.user)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Account</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Sign in or create an account to submit documents and save a payment method.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'signin'
              ? 'bg-teal-700 text-white dark:bg-teal-600'
              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
          }`}
          onClick={() => setMode('signin')}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'signup'
              ? 'bg-teal-700 text-white dark:bg-teal-600'
              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
          }`}
          onClick={() => setMode('signup')}
        >
          Create account
        </button>
      </div>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-teal-600 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-teal-600 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
