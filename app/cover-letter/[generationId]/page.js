import { createServerClient } from '@/lib/supabaseServer'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import CoverLetterView from '@/components/CoverLetterView'

export default async function CoverLetterPage({ params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen) {
    return <div className="p-8">Couldn't find that generation.</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-2xl space-y-4">
        <BackButton />
        <h1 className="font-display text-2xl text-ink">Cover Letter</h1>
        <CoverLetterView generationId={gen.id} initialCoverLetter={gen.cover_letter} />
      </main>
    </div>
  )
}