import { NextResponse } from 'next/server'
import { extractResumeText } from '@/lib/parseResume'
import { checkDocumentTypes } from '@/lib/validateDocumentTypes'
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
    const { data: profile } = await supabase.from('profiles').select('plan, hr_trial_started, hr_trial_used').eq('id', user.id).single()

    const hasFullAccess = profile?.plan === 'hr'
    const hasTrialAccess = profile?.hr_trial_started && !profile?.hr_trial_used

    if (!hasFullAccess && !hasTrialAccess) {
      return NextResponse.json({ error: 'This feature requires the HR / Recruiter plan.' }, { status: 402 })
    }

    const formData = await req.formData()
    const jobTitle = formData.get('jobTitle')
    const orgName = formData.get('orgName')
    const jobDescription = formData.get('jobDescription')
    const jobDescriptionFile = formData.get('jobDescriptionFile')
    const resumeFile = formData.get('resumeFile')
    const coverLetterFile = formData.get('coverLetterFile')

    // --- Compliance fields --------------------------------------------
    // Never trust these values alone for anything security-critical beyond
    // gating this request — they come from the client. The point of
    // re-checking here (not just disabling the button in the UI) is that a
    // disabled button doesn't stop a direct API call.
    const lawfulBasisConfirmed = formData.get('lawfulBasisConfirmed') === 'true'
    const candidateOptedOut = formData.get('candidateOptedOut') === 'true'
    const roleCountry = formData.get('roleCountry') || null
    const roleState = formData.get('roleState') || null
    const roleIsNYC = formData.get('roleIsNYC') === 'true'
    // ---------------------------------------------------------------------

    // Required fields — enforced here too, not just client-side, since this
    // route can be called directly (e.g. by a script) bypassing the UI.
    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json({ error: 'Please enter the job title.' }, { status: 400 })
    }
    if (!orgName || !orgName.trim()) {
      return NextResponse.json({ error: 'Please enter the organization name.' }, { status: 400 })
    }
    if (!roleCountry) {
      return NextResponse.json({ error: 'Please select where this role is located.' }, { status: 400 })
    }
    if (!resumeFile) {
      return NextResponse.json({ error: "Please upload the candidate's résumé." }, { status: 400 })
    }
    if (!jobDescription && !(jobDescriptionFile && jobDescriptionFile.size > 0)) {
      return NextResponse.json({ error: 'Please upload or paste the job description.' }, { status: 400 })
    }

    if (!lawfulBasisConfirmed) {
      return NextResponse.json(
        { error: "You must confirm a lawful basis to submit this candidate's information before it can be evaluated." },
        { status: 400 }
      )
    }

    if (candidateOptedOut) {
      // Record the attempt even though we're not running the AI evaluation,
      // so there's a durable record the opt-out was respected. evaluation_id
      // is null here since no hr_evaluations row is created for this request.
      await supabase.from('hr_consent_audit_log').insert({
        evaluation_id: null,
        user_id: user.id,
        candidate_name: null,
        lawful_basis_confirmed: lawfulBasisConfirmed,
        candidate_opted_out: true,
        role_country: roleCountry,
        role_state: roleState,
        role_is_nyc: roleIsNYC,
      })

      return NextResponse.json(
        { error: 'This candidate opted out of AI-assisted screening. Please evaluate them manually instead.' },
        { status: 403 }
      )
    }

    const resumeText = await extractResumeText(resumeFile)
    const coverLetterText = coverLetterFile && coverLetterFile.size > 0
      ? await extractResumeText(coverLetterFile)
      : ''

    // Job description: an uploaded PDF/DOCX file takes priority over pasted
    // text, same pattern as the résumé handling above.
    let jobDescriptionText = jobDescription || ''
    if (jobDescriptionFile && jobDescriptionFile.size > 0) {
      jobDescriptionText = await extractResumeText(jobDescriptionFile)
    }

    // Catch the "wrong document in the wrong box" mistake before evaluating
    // a candidate on it — e.g. a résumé pasted into the job description
    // field, or the résumé and cover letter swapped. Only blocks on a
    // confident mismatch; see validateDocumentTypes.js.
    const {
      jobDescriptionLooksLikeResume,
      resumeLooksLikeJobDescription,
      resumeLooksLikeCoverLetter,
      coverLetterLooksLikeResume,
    } = await checkDocumentTypes({ jobDescriptionText, resumeText, coverLetterText })

    if (jobDescriptionLooksLikeResume) {
      return NextResponse.json({
        error: 'The job description you added looks like a résumé, not a job posting — please check you added the right one.',
      }, { status: 400 })
    }
    if (resumeLooksLikeJobDescription) {
      return NextResponse.json({
        error: "The candidate's résumé looks like a job posting, not a résumé — please check you uploaded the right file.",
      }, { status: 400 })
    }
    if (resumeLooksLikeCoverLetter) {
      return NextResponse.json({
        error: "The file uploaded as the candidate's résumé looks like a cover letter, not a résumé — please check you uploaded the right file.",
      }, { status: 400 })
    }
    if (coverLetterLooksLikeResume) {
      return NextResponse.json({
        error: "The file uploaded as the candidate's cover letter looks like a résumé, not a cover letter — please check you uploaded the right file.",
      }, { status: 400 })
    }

    const result = await generateHRAnalysis({ resumeText, coverLetterText, jobDescription: jobDescriptionText, jobTitle, orgName })

    const { data, error } = await supabase.from('hr_evaluations').insert({
      user_id: user.id,
      candidate_name: result.candidate_name,
      job_title: jobTitle,
      organization_name: orgName,
      job_description: jobDescriptionText,
      candidate_resume_text: resumeText,
      candidate_cover_letter_text: coverLetterText,
      result_json: result,
      ats_score: result.ats_score,
      manager_score: result.manager_score,
      recommendation: result.recommendation,
      lawful_basis_confirmed: lawfulBasisConfirmed,
      candidate_opted_out: candidateOptedOut,
      role_country: roleCountry,
      role_state: roleState,
      role_is_nyc: roleIsNYC,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Append-only audit record, separate from hr_evaluations so it survives
    // deletion of the evaluation itself (see HistoryPage.js's removeGeneration
    // flow, which lets users delete rows from hr_evaluations).
    await supabase.from('hr_consent_audit_log').insert({
      evaluation_id: data.id,
      user_id: user.id,
      candidate_name: result.candidate_name,
      lawful_basis_confirmed: lawfulBasisConfirmed,
      candidate_opted_out: candidateOptedOut,
      role_country: roleCountry,
      role_state: roleState,
      role_is_nyc: roleIsNYC,
    })

    if (!hasFullAccess && hasTrialAccess) {
      await supabase.from('profiles').update({ hr_trial_used: true }).eq('id', user.id)
    }

    return NextResponse.json({ evaluationId: data.id })
  } catch (err) {
    console.error('hr-analyze route crashed:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong on the server.' }, { status: 500 })
  }
}