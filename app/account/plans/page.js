'use client'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabaseClient'
import BackButton from '@/components/ui/BackButton'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'CAD',
    tagline: 'Try it out',
    priceId: null,
    features: ['3 tailored resumes total', 'Cover letters & application emails', 'ATS + Manager score, with before/after', 'Full generation history'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: 'CAD/month',
    tagline: 'For active job seekers',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    popular: true,
    features: ['Everything in Free, and:', 'Unlimited tailored resumes', 'Unlimited cover letters & emails', 'Reference letter drafts', 'Full interview prep guides', 'Full generation history'],
  },
  {
    id: 'hr',
    name: 'HR / Recruiter',
    price: '$59',
    period: 'CAD/month',
    tagline: 'For hiring managers & recruiters',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HR,
    features: ['Everything in Pro, and:', 'Unlimited candidate evaluations', 'Strengths, weaknesses & missing requirements', 'Downloadable assessment reports (.docx)'],
  },
]

export default function PlansPage() {
  const [userId, setUserId] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loadingPlan, setLoadingPlan] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      if (profile) setCurrentPlan(profile.plan)
    }
    load()
  }, [])
    useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        setLoadingPlan(null)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  async function subscribe(plan) {
    if (!userId) { alert('Please log in first.'); return }
    if (!plan.priceId) return
    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        alert(data.error || 'Could not start checkout.')
        setLoadingPlan(null)
        return
      }
      window.location.href = data.url
    } catch (err) {
      alert('Something went wrong: ' + err.message)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6 pb-16">
        <BackButton />
      <h1 className="text-3xl font-semibold text-center mb-2">Subscription Plans</h1>
      <p className="text-center text-gray-500 mb-10">Pick the plan that fits how you're using the app.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.id
          return (
            <div key={plan.id} className={`relative border rounded-xl p-6 flex flex-col ${plan.popular ? 'border-brand shadow-md' : 'border-gray-200'}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-6 bg-brand text-white text-xs font-medium px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-2 text-sm flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex gap-2 ${f.endsWith(':') ? 'text-gray-500 font-medium' : ''}`}>
                    {!f.endsWith(':') && <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button disabled className="border rounded-lg py-2 text-sm font-medium text-gray-400 cursor-default">
                  Your current plan
                </button>
              ) : plan.id === 'free' ? (
                <button disabled className="border rounded-lg py-2 text-sm font-medium text-gray-400 cursor-default">
                  Default plan
                </button>
              ) : (
                <button onClick={() => subscribe(plan)} disabled={loadingPlan === plan.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white bg-gradient-to-b from-navy-light to-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_-4px_rgba(20,36,61,0.5)] hover:from-brand hover:to-navy-dark active:translate-y-px transition-all disabled:opacity-50">
                  {loadingPlan === plan.id ? 'Redirecting…' : `Get ${plan.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}