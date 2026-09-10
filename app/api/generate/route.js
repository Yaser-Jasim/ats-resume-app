import { NextResponse } from 'next/server'
import { extractResumeText } from '@/lib/parseResume'
import { generateTailoredResume } from '@/lib/generateTailoredResume'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'
import { renderResumeDocx } from '@/lib/renderResumeDocx'

export async function POST(req) {
  try {
        const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile.plan === 'free' && profile.credits_remaining <= 0) {
      return NextResponse.json({ error: 'You are out of free generations — upgrade to continue.' }, { status: 402 })
    }

    const formData = await req.formData()
    const positionTitle = formData.get('positionTitle')
    const orgName = formData.get('orgName')
    const orgAddress = formData.get('orgAddress')
    const jobDescription = formData.get('jobDescription')
    const resumeFile = formData.get('resumeFile')
    const pastedText = formData.get('resumeText')

    let resumeText = pastedText || ''
    if (resumeFile && resumeFile.size > 0) {
      resumeText = await extractResumeText(resumeFile)
    }
    if (!resumeText) {
      return NextResponse.json({ error: 'Please upload or paste a resume.' }, { status: 400 })
    }

    const tailored = await generateTailoredResume({ resumeText, jobDescription, positionTitle, orgName })

    if (profile.plan === 'free') {
      await supabase.from('profiles').update({ credits_remaining: profile.credits_remaining - 1 }).eq('id', user.id)
    }

        const docxBuffer = await renderResumeDocx(tailored, {
      candidateName: tailored.candidate_name,
      address: tailored.address,
      phone: tailored.phone,
      email: tailored.email,
    })

    const { data, error } = await supabase.from('generations').insert({
      user_id: user.id,
      position_title: positionTitle,
      organization_name: orgName,
      organization_address: orgAddress,
      job_description: jobDescription,
      original_resume_text: resumeText,
      tailored_json: tailored,
      ats_score: tailored.ats_score,
      manager_score: tailored.manager_score,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ generationId: data.id })
  } catch (err) {
    console.error('generate route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong on the server.' }, { status: 500 })
  }
}