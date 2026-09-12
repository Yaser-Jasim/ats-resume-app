import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function GET(req) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/app'

  if (code) {
    const supabase = await createRouteClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${next}`)
}