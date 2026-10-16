import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

// Opens Stripe's hosted billing portal for the logged-in user, where they can
// cancel their plan, update their card and download invoices.
export async function POST() {
  try {
    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'There is no billing account to manage yet.' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('billing-portal route crashed:', err)
    return NextResponse.json({ error: err.message || 'Could not open the billing portal.' }, { status: 500 })
  }
}