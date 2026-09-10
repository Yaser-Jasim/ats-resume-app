import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { renderResumeDocx } from '@/lib/renderResumeDocx'
import { buildDownloadFilename, contentDispositionHeader } from '@/lib/filename'

export async function GET(req, { params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()
  if (!gen) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const buffer = await renderResumeDocx(gen.tailored_json, {
    candidateName: gen.tailored_json.candidate_name,
    address: gen.tailored_json.address,
    phone: gen.tailored_json.phone,
    email: gen.tailored_json.email,
  })

    const filename = buildDownloadFilename(gen.tailored_json?.candidate_name, 'Resume')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDispositionHeader(filename),
    },
  })
}