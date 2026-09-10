import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabaseServer'

const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_PRO]: 'pro',
  [process.env.STRIPE_PRICE_HR]: 'hr',
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

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object
    const customerId = sub.customer
    const priceId = sub.items?.data[0]?.price?.id
    const plan = PRICE_TO_PLAN[priceId] || 'pro'

    const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single()
    if (profile) {
      await supabase.from('profiles').update({ plan, credits_remaining: 9999 }).eq('id', profile.id)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_customer_id', sub.customer).single()
    if (profile) await supabase.from('profiles').update({ plan: 'free', credits_remaining: 0 }).eq('id', profile.id)
  }

  return new Response('ok', { status: 200 })
}