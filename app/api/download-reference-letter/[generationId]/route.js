import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { renderReferenceLetterDocx } from '@/lib/renderReferenceLetterDocx'
import { buildDownloadFilename, contentDispositionHeader } from '@/lib/filename'

export async function GET(req, { params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen || !gen.reference_letter) {
    return NextResponse.json({ error: 'Reference letter not found.' }, { status: 404 })
  }

  const buffer = await renderReferenceLetterDocx({
    candidateName: gen.tailored_json?.candidate_name || 'the candidate',
    positionTitle: gen.position_title,
    orgName: gen.organization_name,
    paragraphs: gen.reference_letter.paragraphs,
  })

  const filename = buildDownloadFilename(gen.tailored_json?.candidate_name, 'Reference Letter')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDispositionHeader(filename),
    },
  })
}