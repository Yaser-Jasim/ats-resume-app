import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { renderCoverLetterDocx } from '@/lib/renderCoverLetterDocx'
import { buildDownloadFilename, contentDispositionHeader } from '@/lib/filename'

export async function GET(req, { params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen || !gen.cover_letter) {
    return NextResponse.json({ error: 'Cover letter not found.' }, { status: 404 })
  }

  const buffer = await renderCoverLetterDocx({
    candidateName: gen.tailored_json?.candidate_name || '',
    address: gen.tailored_json?.address || '',
    phone: gen.tailored_json?.phone || '',
    email: gen.tailored_json?.email || '',
    organization: gen.organization_name || '',
    company_address: gen.organization_address || '',
    bodyText: gen.cover_letter,
  })

    const filename = buildDownloadFilename(gen.tailored_json?.candidate_name, 'Cover Letter')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDispositionHeader(filename),
    },
  })
}