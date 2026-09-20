import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function GET(req) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/app'

  if (code) {
    const supabase = await createRouteClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('OAuth exchange error:', error)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}