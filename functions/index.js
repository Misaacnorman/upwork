const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const admin = require('firebase-admin')
const Stripe = require('stripe')

admin.initializeApp()

const stripeSecret = defineSecret('STRIPE_SECRET_KEY')

exports.createSetupIntent = onCall(
  {
    secrets: [stripeSecret],
    region: 'us-central1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required.')
    }

    const stripe = new Stripe(stripeSecret.value())
    const uid = request.auth.uid
    const email = request.auth.token.email || undefined
    const db = admin.firestore()
    const userRef = db.doc(`users/${uid}`)
    const snap = await userRef.get()
    let customerId = snap.get('stripeCustomerId')

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { firebaseUid: uid },
      })
      customerId = customer.id
      await userRef.set({ stripeCustomerId: customerId, email: email || null }, { merge: true })
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { firebaseUid: uid },
    })

    if (!setupIntent.client_secret) {
      throw new HttpsError('internal', 'Missing client secret from Stripe.')
    }

    return { clientSecret: setupIntent.client_secret }
  }
)
