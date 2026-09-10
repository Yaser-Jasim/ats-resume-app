import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { renderHRAssessmentDocx } from '@/lib/renderHRAssessmentDocx'
import { buildDownloadFilename, contentDispositionHeader } from '@/lib/filename'

export async function GET(req, { params }) {
  const { evaluationId } = await params
  const supabase = createServerClient()
  const { data: evalRow } = await supabase.from('hr_evaluations').select('*').eq('id', evaluationId).single()

  if (!evalRow) {
    return NextResponse.json({ error: 'Evaluation not found.' }, { status: 404 })
  }

    const buffer = await renderHRAssessmentDocx({
    candidateName: evalRow.candidate_name,
    jobTitle: evalRow.job_title,
    orgName: evalRow.organization_name,
    atsScore: evalRow.ats_score,
    managerScore: evalRow.manager_score,
    result: evalRow.result_json,
  })

    const filename = buildDownloadFilename(evalRow.candidate_name, 'Assessment')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDispositionHeader(filename),
    },
  })
}