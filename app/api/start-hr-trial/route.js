import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabaseRouteClient'
import { createServerClient } from '@/lib/supabaseServer'

export async function POST(req) {
  try {
    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()
    const { error } = await supabase.from('profiles').update({ hr_trial_started: true }).eq('id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}