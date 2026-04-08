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
      <section className="rounded-lg border border-amber-200/80 bg-amber-50 p-3 text-left dark:border-amber-900/50 dark:bg-amber-950/30">
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Portal unavailable</h2>
        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
          This application is not fully provisioned. Please try again later or contact your administrator.
        </p>
      </section>
    )
  }

  if (user) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Account</h2>
        <p className="mt-1 truncate text-xs text-stone-600 dark:text-stone-400">{user.email}</p>
        <button
          type="button"
          className="mt-2 rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
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
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Sign in</h2>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Access your submissions and billing.</p>
      <div className="mt-2 flex gap-1">
        <button
          type="button"
          className={`rounded px-2 py-1 text-xs font-medium ${
            mode === 'signin'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
          }`}
          onClick={() => setMode('signin')}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded px-2 py-1 text-xs font-medium ${
            mode === 'signup'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
          }`}
          onClick={() => setMode('signup')}
        >
          Register
        </button>
      </div>
      <form className="mt-2 space-y-2" onSubmit={submit}>
        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-stone-900 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
