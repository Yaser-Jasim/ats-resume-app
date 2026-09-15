import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabaseServer'

export async function POST(req) {
  const { priceId, userId } = await req.json()
  const supabase = createServerClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()

  let customerId = profile.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { userId } })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId)
  }

  async function createSession(customer) {
    return stripe.checkout.sessions.create({
      customer,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans`,
    })
  }

  let session
  try {
    session = await createSession(customerId)
  } catch (err) {
    // The saved customer ID doesn't exist in this Stripe mode (e.g. a leftover
    // test-mode ID). Create a fresh one automatically and retry once.
    if (err.code === 'resource_missing' && err.param === 'customer') {
      const newCustomer = await stripe.customers.create({ metadata: { userId } })
      customerId = newCustomer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId)
      session = await createSession(customerId)
    } else {
      throw err
    }
  }

  return NextResponse.json({ url: session.url })
}