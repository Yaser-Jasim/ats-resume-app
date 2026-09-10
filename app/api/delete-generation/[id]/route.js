import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function DELETE(req, { params }) {
  const { id } = await params
  const routeClient = await createRouteClient()
  const { data: { user } } = await routeClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('user_id').eq('id', id).single()

  if (!gen || gen.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const { error } = await supabase.from('generations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}