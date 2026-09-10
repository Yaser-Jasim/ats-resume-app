'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'

export default function HistoryPage() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('candidates')
  const [search, setSearch] = useState('')
  const [generations, setGenerations] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [{ data: gens }, { data: evals }] = await Promise.all([
        supabase.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('hr_evaluations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setGenerations(gens || [])
      setEvaluations(evals || [])
      setLoading(false)
    }
    load()
  }, [])

  async function removeGeneration(id) {
    if (!confirm("Remove this résumé permanently? This can't be undone.")) return
    const res = await fetch(`/api/delete-generation/${id}`, { method: 'DELETE' })
    if (res.ok) setGenerations(prev => prev.filter(g => g.id !== id))
  }

  async function removeEvaluation(id) {
    if (!confirm("Remove this assessment permanently? This can't be undone.")) return
    const res = await fetch(`/api/delete-hr-evaluation/${id}`, { method: 'DELETE' })
    if (res.ok) setEvaluations(prev => prev.filter(e => e.id !== id))
  }

  const filteredGenerations = useMemo(() => {
    if (!search.trim()) return generations
    const q = search.toLowerCase()
    return generations.filter(g => (g.tailored_json?.candidate_name || '').toLowerCase().includes(q))
  }, [generations, search])

  const filteredEvaluations = useMemo(() => {
    if (!search.trim()) return evaluations
    const q = search.toLowerCase()
    return evaluations.filter(e => (e.candidate_name || '').toLowerCase().includes(q))
  }, [evaluations, search])

  if (loading) {
    return <div className="flex"><Sidebar /><main className="p-8"><BackButton /><p className="text-sm text-gray-500">Loading…</p></main></div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-3xl">
        <BackButton />
        <h1 className="font-display text-2xl text-ink mb-6">Search & Downloads</h1>

        <div className="flex gap-3 mb-6">
          <div className="w-44">
            <Select value={view} onChange={e => setView(e.target.value)}>
              <option value="candidates">Candidates</option>
              <option value="hr">HR Assessments</option>
            </Select>
          </div>
          <div className="flex-1">
            <Input placeholder="Search by candidate name…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {view === 'candidates' ? (
          <div className="space-y-3">
            {filteredGenerations.length === 0 && <p className="text-sm text-gray-500">No résumés found.</p>}
            {filteredGenerations.map(g => (
              <div key={g.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{g.tailored_json?.candidate_name || 'Unnamed candidate'}</p>
                  <p className="text-sm text-gray-500">{g.position_title} — {g.organization_name}</p>
                  <p className="text-xs text-gray-400">{new Date(g.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 text-sm flex-shrink-0">
                  <a href={`/result/${g.id}`} className="text-brand font-medium hover:underline">View</a>
                  <button onClick={() => removeGeneration(g.id)} className="text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvaluations.length === 0 && <p className="text-sm text-gray-500">No assessments found.</p>}
            {filteredEvaluations.map(e => (
              <div key={e.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{e.candidate_name || 'Unnamed candidate'}</p>
                  <p className="text-sm text-gray-500">{e.job_title} — {e.organization_name}</p>
                  <p className="text-xs text-gray-400">{new Date(e.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 text-sm flex-shrink-0">
                  <a href={`/hr/result/${e.id}`} className="text-brand font-medium hover:underline">View</a>
                  <button onClick={() => removeEvaluation(e.id)} className="text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}