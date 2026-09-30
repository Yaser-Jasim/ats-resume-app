import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'

// POST increments the site-wide counter and returns the new total — called
// once per page load by <PageViewCounter />. GET just reads the current
// total without incrementing, in case anything needs to display it without
// counting itself as a view.

export async function POST() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.rpc('increment_page_views')
    if (error) throw error
    return NextResponse.json({ total: data })
  } catch (err) {
    console.error('page-views increment failed:', err)
    return NextResponse.json({ total: null }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('page_views').select('total').eq('id', 1).single()
    if (error) throw error
    return NextResponse.json({ total: data.total })
  } catch (err) {
    console.error('page-views fetch failed:', err)
    return NextResponse.json({ total: null }, { status: 500 })
  }
}