import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabaseServer'

// Maps a Stripe price ID to a Resemy plan. Both env var spellings are accepted
// because the plans page reads NEXT_PUBLIC_* while the server used STRIPE_*.
const PRICE_TO_PLAN = {}
for (const [priceId, plan] of [
  [process.env.STRIPE_PRICE_PRO, 'pro'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO, 'pro'],
  [process.env.STRIPE_PRICE_HR, 'hr'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_HR, 'hr'],
]) {
  if (priceId) PRICE_TO_PLAN[priceId] = plan
}

// Paid access continues in these states (past_due = Stripe is still retrying the card).
const GRANTING_STATUSES = ['active', 'trialing', 'past_due']
// The subscription is over in these states, so access should end.
const ENDED_STATUSES = ['canceled', 'unpaid', 'incomplete_expired']

// Works out the right plan from everything Stripe says the customer has,
// rather than trusting a single event, so out-of-order or repeated events
// can't leave someone on the wrong plan.
async function syncCustomerPlan(supabase, customerId, { allowDowngrade }) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  if (profileError) throw profileError
  if (!profile) return // this Stripe customer isn't linked to a profile

  const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 20 })

  let plan = 'free'
  for (const sub of subscriptions.data) {
    if (!GRANTING_STATUSES.includes(sub.status)) continue
    const priceId = sub.items?.data[0]?.price?.id
    const subPlan = PRICE_TO_PLAN[priceId]
    if (!subPlan) {
      // Fail loudly (Stripe will retry and flag it) instead of guessing a plan.
      throw new Error(`Unrecognized Stripe price ${priceId} on subscription ${sub.id}`)
    }
    if (subPlan === 'hr' || plan === 'free') plan = subPlan
  }

  if (plan !== 'free') {
    if (profile.plan !== plan) {
      const { error } = await supabase
        .from('profiles')
        .update({ plan, credits_remaining: 9999 })
        .eq('id', profile.id)
      if (error) throw error
    }
    return
  }

  // No live subscription. Only downgrade when the subscription has actually
  // ended, so a payment that is still pending can't wipe a free user's credits.
  if (allowDowngrade && profile.plan !== 'free') {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'free', credits_remaining: 0 })
      .eq('id', profile.id)
    if (error) throw error
  }
}

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
  }

  const supabase = createServerClient()

  try {
    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const sub = event.data.object
      const allowDowngrade =
        event.type === 'customer.subscription.deleted' || ENDED_STATUSES.includes(sub.status)
      await syncCustomerPlan(supabase, sub.customer, { allowDowngrade })
    }
  } catch (err) {
    console.error('Stripe webhook handler failed:', event.type, err)
    // A non-2xx response makes Stripe retry, and shows the failure in the dashboard.
    return new Response('Webhook handler error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
}