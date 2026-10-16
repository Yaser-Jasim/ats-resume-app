import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

// Only prices that belong to Resemy's own plans may be sent to Stripe.
// Without this, anyone could post any price ID from the Stripe account.
const ALLOWED_PRICE_IDS = [
  process.env.STRIPE_PRICE_PRO,
  process.env.STRIPE_PRICE_HR,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_HR,
].filter(Boolean)

// A subscription in one of these states still counts as a live plan.
const LIVE_STATUSES = ['active', 'trialing', 'past_due']

async function getOrCreateCustomer(supabase, user, savedCustomerId) {
  if (savedCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(savedCustomerId)
      if (!existing.deleted) return savedCustomerId
    } catch (err) {
      // An ID saved under a different Stripe mode (e.g. test mode) doesn't
      // exist here. Fall through and create a fresh customer.
      if (err.code !== 'resource_missing') throw err
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id },
  })
  await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)
  return customer.id
}

export async function POST(req) {
  try {
    // Who is paying comes from the logged-in session, never from the request body.
    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const { priceId } = await req.json()
    if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
      return NextResponse.json({ error: 'That plan is not available.' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .eq('id', user.id)
      .single()
    if (!profile) {
      return NextResponse.json({ error: 'We could not find your account.' }, { status: 404 })
    }

    const customerId = await getOrCreateCustomer(supabase, user, profile.stripe_customer_id)
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/plans`

    // Someone who already has a live subscription must not get a second one
    // (that would bill them for both plans). Send them to Stripe's billing
    // portal instead, where they can switch plans or cancel.
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 20 })
    const hasLiveSubscription = subscriptions.data.some(s => LIVE_STATUSES.includes(s.status))
    if (hasLiveSubscription) {
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })
      return NextResponse.json({ url: portal.url, existingSubscription: true })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans?success=true`,
      cancel_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout route crashed:', err)
    return NextResponse.json({ error: err.message || 'Could not start checkout.' }, { status: 500 })
  }
}