'use client'
// components/RoleLocationField.jsx
//
// "Where is this role located?" field for the HR evaluation submission form.
// Purely informational/nudge — it does not block submission. It exists so
// (a) you have the role's jurisdiction on record for every evaluation, and
// (b) the recruiter sees a plain-language reminder instead of silence when
// the role is somewhere with AI-hiring disclosure/audit rules.
//
// Drop this in above or beside your existing evaluation form fields. Wire
// `onChange` to store { country, state, isNYC } in your form state, and pass
// that same object straight into the audit log write (see sql/ and README.md).

import { useState } from 'react'
import { COUNTRIES, US_STATES, getJurisdictionNotice } from '@/lib/jurisdictionCheck'

export default function RoleLocationField({ value, onChange }) {
  const [local, setLocal] = useState(value || { country: '', state: '', isNYC: false })

  function update(patch) {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange?.(next)
  }

  const notice = getJurisdictionNotice(local)

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Where is this role located? <span className="text-red-500">*</span>
        </label>
        <select
          value={local.country}
          onChange={e => update({ country: e.target.value, state: '', isNYC: false })}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Select country…</option>
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {local.country === 'United States' && (
        <div>
          <label className="block text-sm font-medium text-ink mb-1">State</label>
          <select
            value={local.state}
            onChange={e => update({ state: e.target.value, isNYC: false })}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Select state…</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {local.state === 'New York' && (
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!local.isNYC}
            onChange={e => update({ isNYC: e.target.checked })}
            className="mt-0.5"
          />
          This position is based within New York City specifically
        </label>
      )}

      {notice && (
        <div
          className={`text-sm rounded-lg px-3 py-2.5 border ${
            notice.level === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          {notice.message}
        </div>
      )}
    </div>
  )
}
