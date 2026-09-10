import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import ScoreBadge from '@/components/ScoreBadge'
import DownloadButton from '@/components/DownloadButton'
import ApplicationEmailButton from '@/components/ApplicationEmailButton'
import ReferenceLetterButton from '@/components/ReferenceLetterButton'
import InterviewPrepView from '@/components/InterviewPrepView'

export default async function ResultPage({ params }) {
  const { generationId } = await params
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen) {
    return <div className="p-8">Couldn't find that generation. It may not have saved correctly — try generating again.</div>
  }
  const routeClient = await createRouteClient()
  const { data: { user } } = await routeClient.auth.getUser()
  let isFree = true
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    isFree = !profile || profile.plan === 'free'
  }
  const r = gen.tailored_json

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-5xl">
        <BackButton />
        <h1 className="font-display text-2xl text-ink mb-6">{gen.position_title} candidate</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Left column — the résumé itself */}
          <div className="space-y-6">
            <Section title="Professional Summary"><p>{r.summary}</p></Section>

            <Section title="Skills"><p>{r.skills.join(' | ')}</p></Section>

            <Section title="Professional Experience">
              {r.jobs.map((job, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-medium text-ink">
                    <span>{job.title} — {job.organization}, {job.location}</span>
                    <span className="italic text-sm text-gray-500">{job.dates}</span>
                  </div>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </Section>

            <Section title="Education">
              {r.education.map((e, i) => <p key={i} className="text-sm">{e.degree} | {e.school}, {e.location}</p>)}
            </Section>

            <Section title="Certifications"><p className="text-sm">{r.certifications}</p></Section>

            <p className="text-xs text-gray-500">
              These are the sections our ATS scoring recommends. Add References, an Appendix, or anything else
              you'd like after Certifications — just paste it into the downloaded document.
            </p>
          </div>

          {/* Right column — scores + every next action, always visible */}
          <div className="lg:sticky lg:top-8 self-start space-y-4">
            <div className="flex gap-3">
              <ScoreBadge label="ATS score" value={gen.ats_score} color="green" />
              <ScoreBadge label="Manager hit" value={gen.manager_score} color="blue" />
            </div>

            {r.original_ats_score != null && (
              <p className="text-xs text-gray-600">
                Original resume: <span className="font-medium">{r.original_ats_score}%</span> match →
                tailored: <span className="font-medium text-green-700">{gen.ats_score}%</span>.
              </p>
            )}

            {r.score_notes && (
              <p className="text-xs text-gray-600 italic border-l-2 border-gray-200 pl-2">{r.score_notes}</p>
            )}

            {(r.matched_keywords?.length > 0 || r.missing_keywords?.length > 0) && (
              <div className="text-xs space-y-1.5 bg-mist rounded-lg p-3">
                {r.matched_keywords?.length > 0 && (
                  <p><span className="font-medium text-green-700">Matched: </span>{r.matched_keywords.join(', ')}</p>
                )}
                {r.missing_keywords?.length > 0 && (
                  <p><span className="font-medium text-amber-700">Still missing: </span>{r.missing_keywords.join(', ')}</p>
                )}
              </div>
            )}

            <div className="pt-2">
              <DownloadButton generationId={gen.id} />
            </div>

            <a href={`/cover-letter/${gen.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all">
            Generate cover letter →
            </a>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-600">Want a short, brief email to send when you apply?</p>
              <ApplicationEmailButton generationId={gen.id} initialEmail={gen.application_email} />
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-600">Want a head start on a reference letter for your references to personalize?</p>
              <ReferenceLetterButton generationId={gen.id} initialLetter={gen.reference_letter} locked={isFree} />
            </div>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-600">Ready to prep for the actual interview?</p>
              <InterviewPrepView generationId={gen.id} initialPrep={gen.interview_prep} locked={isFree} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="border-b border-gray-100 pb-1 mb-2">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-ink">{title}</h2>
      </div>
      {children}
    </div>
  )
}