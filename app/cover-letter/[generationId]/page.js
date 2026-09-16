import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'
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

  const routeClient = await createRouteClient()
  const { data: { user } } = await routeClient.auth.getUser()
  let isFree = true
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    isFree = !profile || profile.plan === 'free'
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-2xl space-y-4">
        <BackButton />
        <h1 className="font-display text-2xl text-ink">Cover Letter</h1>
        {isFree ? (
          <div className="border border-dashed rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">🔒 Cover letters are a Pro feature.</p>
            <a href="/account/plans" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
              Upgrade to Pro
            </a>
          </div>
        ) : (
          <CoverLetterView generationId={gen.id} initialCoverLetter={gen.cover_letter} />
        )}
      </main>
    </div>
  )
}