'use client'
// components/HrConsentSection.jsx
//
// Drop this into the HR evaluation submission form, above the
// "Run AI Evaluation" button. It covers two of the five compliance items:
//
//   1. A REQUIRED, blocking lawful-basis consent checkbox.
//   2. An optional candidate-notice template (copyable) + a candidate
//      opt-out toggle. If the candidate opted out, AI evaluation is blocked
//      for this submission — the recruiter should proceed manually instead.
//
// This component does not call your API. It only tracks local state and
// reports it upward via onChange, so you decide what to do with it (disable
// your submit button, include it in the request payload, etc.). Wire
// `canSubmit` from the onChange payload to whatever currently gates your
// "Run AI Evaluation" / "Submit" button.
//
// IMPORTANT: this component does not persist anything. The actual audit
// record must be written server-side at the moment of submission — see
// sql/audit_logging_migration.sql and README.md. Client-side state can be
// tampered with; the durable record has to come from your API route/server
// action, using the values this component hands you plus the authenticated
// user id and a server-generated timestamp.

import { useState } from 'react'

const DEFAULT_NOTICE_TEMPLATE =
  "As part of our hiring process, your application materials (resume/CV and cover letter) may be reviewed with AI-assisted screening to help evaluate fit for this role. A human reviewer makes the final decision. If you'd prefer your materials not be reviewed this way, please let us know and we will evaluate them manually instead."

export default function HrConsentSection({ candidateName, onChange }) {
  const [lawfulBasisConfirmed, setLawfulBasisConfirmed] = useState(false)
  const [candidateOptedOut, setCandidateOptedOut] = useState(false)
  const [copied, setCopied] = useState(false)

  function emit(patch) {
    const next = {
      lawfulBasisConfirmed,
      candidateOptedOut,
      ...patch,
    }
    const canSubmit = next.lawfulBasisConfirmed && !next.candidateOptedOut
    onChange?.({ ...next, canSubmit })
  }

  function handleLawfulBasis(checked) {
    setLawfulBasisConfirmed(checked)
    emit({ lawfulBasisConfirmed: checked })
  }

  function handleOptOut(checked) {
    setCandidateOptedOut(checked)
    emit({ candidateOptedOut: checked })
  }

  async function copyNotice() {
    try {
      await navigator.clipboard.writeText(DEFAULT_NOTICE_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, insecure context); the text is
      // already selectable in the box below, so this is a soft failure.
    }
  }

  return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-mist/40">
      <div>
        <p className="text-sm font-medium text-ink mb-1">
          Candidate notice{candidateName ? ` — ${candidateName}` : ''}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Copy this to send to the candidate before or when you evaluate them. This
          notice is your responsibility to send, not Resemy's — we're just making it easy.
        </p>
        <div className="relative">
          <textarea
            readOnly
            value={DEFAULT_NOTICE_TEMPLATE}
            rows={3}
            className="w-full text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 resize-none"
            onFocus={e => e.target.select()}
          />
          <button
            type="button"
            onClick={copyNotice}
            className="absolute top-2 right-2 text-xs font-medium text-brand bg-white border rounded-md px-2 py-1 hover:bg-mist"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={candidateOptedOut}
          onChange={e => handleOptOut(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          The candidate has opted out of AI-assisted screening for this evaluation.
          {candidateOptedOut && (
            <span className="block mt-1 text-amber-700 font-medium">
              AI evaluation is disabled for this submission — please evaluate this
              candidate manually instead.
            </span>
          )}
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-gray-700 pt-2 border-t border-gray-200">
        <input
          type="checkbox"
          required
          checked={lawfulBasisConfirmed}
          onChange={e => handleLawfulBasis(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          <strong>I confirm</strong> I have this candidate's consent, or another lawful
          basis, to submit their information for AI-assisted evaluation, and that I have
          reviewed Resemy's{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            Terms of Service
          </a>{' '}
          regarding candidate data. <span className="text-red-600">*</span>
        </span>
      </label>
    </div>
  )
}
