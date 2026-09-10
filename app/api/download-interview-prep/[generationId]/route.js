import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { renderInterviewPrepDocx } from '@/lib/renderInterviewPrepDocx'
import { buildDownloadFilename, contentDispositionHeader } from '@/lib/filename'

export async function GET(req, { params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen || !gen.interview_prep) {
    return NextResponse.json({ error: 'Interview prep not found.' }, { status: 404 })
  }

  const buffer = await renderInterviewPrepDocx({
    candidateName: gen.tailored_json?.candidate_name || 'Candidate',
    positionTitle: gen.position_title,
    orgName: gen.organization_name,
    prep: gen.interview_prep,
  })

  const filename = buildDownloadFilename(gen.tailored_json?.candidate_name, 'Interview Prep')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDispositionHeader(filename),
    },
  })
}