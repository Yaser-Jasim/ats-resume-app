import { NextResponse } from 'next/server'
import { generateReferenceLetterContent } from '@/lib/generateReferenceLetterContent'
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

    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    if (profile?.plan === 'free') {
      return NextResponse.json({ error: 'Reference letters require the Pro plan.' }, { status: 402 })
    }

    const result = await generateReferenceLetterContent({
      resumeText: gen.original_resume_text,
      jobDescription: gen.job_description,
      positionTitle: gen.position_title,
      orgName: gen.organization_name,
      candidateName: gen.tailored_json?.candidate_name || 'the candidate',
    })

    await supabase.from('generations').update({ reference_letter: result }).eq('id', generationId)

    return NextResponse.json({ paragraphs: result.paragraphs })
  } catch (err) {
    console.error('generate-reference-letter route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}