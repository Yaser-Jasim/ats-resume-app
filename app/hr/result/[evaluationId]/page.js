import { createServerClient } from '@/lib/supabaseServer'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import ScoreBadge from '@/components/ScoreBadge'

const REC_COLORS = {
  'Strong Match': 'bg-green-100 text-green-800',
  'Possible Match': 'bg-amber-100 text-amber-800',
  'Not a Match': 'bg-red-100 text-red-800',
}

export default async function HREvaluationPage({ params }) {
  const { evaluationId } = await params
  const supabase = createServerClient()
  const { data: evalRow } = await supabase.from('hr_evaluations').select('*').eq('id', evaluationId).single()

  if (!evalRow) {
    return <div className="p-8">Couldn't find that evaluation.</div>
  }

  const r = evalRow.result_json

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-5xl">
        <BackButton />
        <h1 className="font-display text-2xl text-ink mb-1">{evalRow.candidate_name || 'Candidate'}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {evalRow.job_title}{evalRow.organization_name ? ` — ${evalRow.organization_name}` : ''}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Left column — the full write-up */}
          <div className="space-y-6">
            <p className="text-sm text-gray-700">{r.summary_notes}</p>

            <Section title="Strengths">
              <ul className="list-disc ml-5 text-sm space-y-1">{r.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </Section>

            <Section title="Weaknesses">
              <ul className="list-disc ml-5 text-sm space-y-1">{r.weaknesses?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </Section>

            <Section title="Matched Requirements">
              <p className="text-sm">{r.matched_requirements?.join(', ') || 'None identified'}</p>
            </Section>

            <Section title="Missing Requirements">
              <p className="text-sm">{r.missing_requirements?.join(', ') || 'None — candidate meets all stated requirements'}</p>
            </Section>

            <Section title="Education">
              <p className="text-sm">{r.education_check}</p>
            </Section>

            <Section title="Experience">
              <p className="text-sm">{r.experience_check}</p>
            </Section>

            {r.red_flags?.length > 0 && (
              <Section title="Worth Double-Checking">
                <ul className="list-disc ml-5 text-sm space-y-1 text-amber-800">{r.red_flags.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Section>
            )}
          </div>

          {/* Right column — scores + actions, always visible */}
          <div className="lg:sticky lg:top-8 self-start space-y-4">
            <div className="flex gap-3">
              <ScoreBadge label="ATS score" value={evalRow.ats_score} color="green" />
              <ScoreBadge label="Manager hit" value={evalRow.manager_score} color="blue" />
            </div>

            <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${REC_COLORS[r.recommendation] || 'bg-gray-100 text-gray-800'}`}>
              {r.recommendation}
            </span>

            <div className="pt-2">
              <a href={`/api/download-hr-assessment/${evalRow.id}`}
                 className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark transition-all">
                Download assessment (.docx)
              </a>
            </div>

            <a href="/hr" className="block text-sm text-gray-500 hover:text-ink pt-2">← Evaluate another candidate</a>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-semibold text-sm uppercase tracking-wide text-ink border-b border-gray-100 pb-1 mb-2">{title}</h2>
      {children}
    </div>
  )
}