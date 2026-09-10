import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req) {
  const { customerId } = await req.json()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans`,
  })
  return NextResponse.json({ url: session.url })
}