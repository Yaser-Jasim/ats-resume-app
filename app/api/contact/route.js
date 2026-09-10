import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Resemy Contact <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact route crashed:', err)
    return NextResponse.json({ error: 'Something went wrong — please try again.' }, { status: 500 })
  }
}