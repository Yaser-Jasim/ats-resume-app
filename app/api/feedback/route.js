import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'
import { resend } from '@/lib/resend'

export async function POST(req) {
  try {
    const { message } = await req.json()
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 })
    }

    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()
    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      user_email: user.email,
      message,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    try {
      await resend.emails.send({
        from: 'Feedback <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL,
        subject: 'New feedback submitted',
        text: `From: ${user.email}\n\n${message}`,
      })
    } catch (emailErr) {
      console.error('Feedback email notification failed:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('feedback route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}