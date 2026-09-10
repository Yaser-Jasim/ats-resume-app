import { NextResponse } from 'next/server'
import { generateApplicationEmail } from '@/lib/generateApplicationEmail'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function POST(req) {
  try {
    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const { generationId } = await req.json()
    const supabase = createServerClient()
    const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

    if (!gen || gen.user_id !== user.id) {
      return NextResponse.json({ error: 'Generation not found.' }, { status: 404 })
    }

    const email = await generateApplicationEmail({
      resumeText: gen.original_resume_text,
      jobDescription: gen.job_description,
      positionTitle: gen.position_title,
      orgName: gen.organization_name,
      tailoredSummary: gen.tailored_json?.summary || '',
    })

    await supabase.from('generations').update({ application_email: email }).eq('id', generationId)

    return NextResponse.json({ email })
  } catch (err) {
    console.error('generate-application-email route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}