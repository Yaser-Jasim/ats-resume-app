import { NextResponse } from 'next/server'
import { extractResumeText } from '@/lib/parseResume'
import { generateHRAnalysis } from '@/lib/generateHRAnalysis'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function POST(req) {
  try {
        const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    if (profile?.plan !== 'hr') {
      return NextResponse.json({ error: 'This feature requires the HR / Recruiter plan.' }, { status: 402 })
    }

    const formData = await req.formData()
    const jobTitle = formData.get('jobTitle')
    const orgName = formData.get('orgName')
    const jobDescription = formData.get('jobDescription')
    const resumeFile = formData.get('resumeFile')
    const coverLetterFile = formData.get('coverLetterFile')

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: 'Job description and candidate resume are both required.' }, { status: 400 })
    }

    const resumeText = await extractResumeText(resumeFile)
    const coverLetterText = coverLetterFile && coverLetterFile.size > 0
      ? await extractResumeText(coverLetterFile)
      : ''

    const result = await generateHRAnalysis({ resumeText, coverLetterText, jobDescription, jobTitle, orgName })

    
    const { data, error } = await supabase.from('hr_evaluations').insert({
      user_id: user.id,
      candidate_name: result.candidate_name,
      job_title: jobTitle,
      organization_name: orgName,
      job_description: jobDescription,
      candidate_resume_text: resumeText,
      candidate_cover_letter_text: coverLetterText,
      result_json: result,
      ats_score: result.ats_score,
      manager_score: result.manager_score,
      recommendation: result.recommendation,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ evaluationId: data.id })
  } catch (err) {
    console.error('hr-analyze route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong on the server.' }, { status: 500 })
  }
}