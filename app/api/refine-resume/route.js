import { NextResponse } from 'next/server'
import { generateTailoredResume } from '@/lib/generateTailoredResume'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export const maxDuration = 60

export async function POST(req) {
  try {
    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { generationId, additionalCandidateNotes } = await req.json()
    if (!generationId || !additionalCandidateNotes) {
      return NextResponse.json({ error: 'Missing generation ID or additional experience notes.' }, { status: 400 })
    }

    const { data: generation, error: fetchError } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !generation) {
      return NextResponse.json({ error: 'Generation not found.' }, { status: 404 })
    }

    const tailored = await generateTailoredResume({
      resumeText: generation.original_resume_text,
      jobDescription: generation.job_description,
      positionTitle: generation.position_title,
      orgName: generation.organization_name,
      additionalCandidateNotes,
    })

      const { error: updateError } = await supabase
      .from('generations')
      .update({
        tailored_json: tailored,
        ats_score: tailored.ats_score,
        manager_score: tailored.manager_score,
        cover_letter: null,
        application_email: null,
        reference_letter: null,
        interview_prep: null,
      })
      .eq('id', generationId)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    return NextResponse.json({ tailored })
  } catch (err) {
    console.error('refine-resume route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong on the server.' }, { status: 500 })
  }
}