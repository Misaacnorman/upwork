import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { httpsCallable } from 'firebase/functions'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db, firebaseReady, functions } from '../firebase'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

type Props = {
  user: User
}

function SetupForm({ user, clientSecret, onSuccess }: { user: User; clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements || !db) return
    setBusy(true)
    setError(null)
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Validation failed')
      setBusy(false)
      return
    }
    const { error: confirmError, setupIntent } = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.origin + window.location.pathname,
      },
      redirect: 'if_required',
    })
    if (confirmError) {
      setError(confirmError.message ?? 'Could not save card')
      setBusy(false)
      return
    }
    if (setupIntent?.status === 'succeeded' && setupIntent.payment_method) {
      const pmId =
        typeof setupIntent.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent.payment_method.id
      await setDoc(
        doc(db, 'users', user.uid, 'paymentMethods', pmId),
        {
          stripePaymentMethodId: pmId,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )
      onSuccess()
    }
    setBusy(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
      >
        {busy ? 'Saving…' : 'Save payment method'}
      </button>
    </form>
  )
}

export function PaymentMethods({ user }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!firebaseReady || !functions || !publishableKey || !stripePromise) return
    let cancelled = false
    ;(async () => {
      try {
        const createSetupIntent = httpsCallable(functions, 'createSetupIntent')
        const result = await createSetupIntent()
        const data = result.data as { clientSecret?: string }
        if (!cancelled && data.clientSecret) {
          setClientSecret(data.clientSecret)
          setLoadError(null)
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setClientSecret(null)
          setLoadError(e instanceof Error ? e.message : 'Could not start card setup.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user.uid, refreshKey])

  if (!firebaseReady) {
    return null
  }

  if (!publishableKey || !stripePromise) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Payment methods
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Add <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">VITE_STRIPE_PUBLISHABLE_KEY</code> to{' '}
          <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">.env</code> and deploy the{' '}
          <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">createSetupIntent</code> Cloud Function
          with Stripe secret configured. Test cards work in Stripe test mode.
        </p>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Payment methods
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {loadError}
        </p>
        <button
          type="button"
          className="mt-3 text-sm font-medium text-teal-700 underline dark:text-teal-400"
          onClick={() => {
            setLoadError(null)
            setRefreshKey((k) => k + 1)
          }}
        >
          Try again
        </button>
      </section>
    )
  }

  if (done) {
    return (
      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-left dark:border-teal-900 dark:bg-teal-950/40">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Payment method saved
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Your card is stored with Stripe. You can add another method below.
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-teal-800 underline dark:text-teal-300"
          onClick={() => {
            setDone(false)
            setClientSecret(null)
            setRefreshKey((k) => k + 1)
          }}
        >
          Add another
        </button>
      </section>
    )
  }

  if (!clientSecret) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Payment methods
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Preparing secure card form…</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Payment methods</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Add a card for future charges. Powered by Stripe (use test cards in development).
      </p>
      <div className="mt-4">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#0f766e',
              },
            },
          }}
        >
          <SetupForm
            user={user}
            clientSecret={clientSecret}
            onSuccess={() => setDone(true)}
          />
        </Elements>
      </div>
    </section>
  )
}
