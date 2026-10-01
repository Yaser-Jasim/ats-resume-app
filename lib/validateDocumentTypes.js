import { anthropic } from './anthropic'

// How much of each text to send for classification. This only needs enough
// to identify what kind of document it is (a résumé's contact/education
// block, a job posting's "Responsibilities" section, etc.) — sending the
// full text would cost more without improving the classification.
const SNIPPET_LENGTH = 3000

function snippet(text) {
  return (text || '').slice(0, SNIPPET_LENGTH)
}

// Checks that documents weren't put in the wrong box — the job description
// isn't actually a résumé, the résumé isn't actually a job description, and
// (when a cover letter is supplied) the résumé and cover letter weren't
// swapped. One combined API call keeps this cheap and fast. Deliberately
// conservative: only flags a *confident* mismatch, so an unusual-but-real
// document (a short job posting, an informally written résumé) is never
// blocked. If the check itself fails for any reason, it fails open —
// the flow proceeds rather than getting stuck on validation plumbing.
export async function checkDocumentTypes({ jobDescriptionText, resumeText, coverLetterText }) {
  const fallback = {
    jobDescriptionLooksLikeResume: false,
    resumeLooksLikeJobDescription: false,
    resumeLooksLikeCoverLetter: false,
    coverLetterLooksLikeResume: false,
  }

  const hasCoverLetter = !!(coverLetterText && coverLetterText.trim())

  try {
    const coverLetterSection = hasCoverLetter
      ? `

TEXT_C (submitted as the candidate's cover letter):
"""
${snippet(coverLetterText)}
"""`
      : ''

    const coverLetterInstructions = hasCoverLetter
      ? ` Also compare TEXT_B against TEXT_C: a résumé is a structured list of work history entries, dates, titles, and skills; a cover letter is a short prose letter addressed to an employer explaining interest in one specific role, usually ending with a signoff like "Sincerely,". Only flag resumeLooksLikeCoverLetter or coverLetterLooksLikeResume when you are confident — a short or informally written document of the right kind is still fine.`
      : ''

    const jsonShape = hasCoverLetter
      ? '{"jobDescriptionLooksLikeResume": true|false, "resumeLooksLikeJobDescription": true|false, "resumeLooksLikeCoverLetter": true|false, "coverLetterLooksLikeResume": true|false}'
      : '{"jobDescriptionLooksLikeResume": true|false, "resumeLooksLikeJobDescription": true|false}'

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 250,
      messages: [
        {
          role: 'user',
          content: `You will see texts submitted under different labels. Check whether any was put in the wrong place.

TEXT_A was submitted as a "job description" and TEXT_B was submitted as a "résumé". Only answer "true" for a mismatch when you are confident — e.g. TEXT_A clearly belongs to one named individual with their own work history, education, and contact details (that's a résumé, not a job posting), or TEXT_B clearly reads as an employer's posting with role requirements and application instructions (that's a job description, not a résumé). If either text is short, informally written, or just unusual, but is still plausibly the right kind of document, answer "false" — do not guess.${coverLetterInstructions}

Respond with ONLY this JSON object, no other text:
${jsonShape}

TEXT_A (submitted as job description):
"""
${snippet(jobDescriptionText)}
"""

TEXT_B (submitted as résumé):
"""
${snippet(resumeText)}
"""${coverLetterSection}`,
        },
      ],
    })

    const textBlock = message.content.find(block => block.type === 'text')
    const raw = textBlock?.text?.trim() || ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return fallback

    const parsed = JSON.parse(match[0])
    return {
      jobDescriptionLooksLikeResume: parsed.jobDescriptionLooksLikeResume === true,
      resumeLooksLikeJobDescription: parsed.resumeLooksLikeJobDescription === true,
      resumeLooksLikeCoverLetter: parsed.resumeLooksLikeCoverLetter === true,
      coverLetterLooksLikeResume: parsed.coverLetterLooksLikeResume === true,
    }
  } catch (err) {
    console.error('checkDocumentTypes failed — proceeding without this check:', err)
    return fallback
  }
}