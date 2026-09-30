import { anthropic } from './anthropic'

// How much of each text to send for classification. This only needs enough
// to identify what kind of document it is (a résumé's contact/education
// block, a job posting's "Responsibilities" section, etc.) — sending the
// full text would cost more without improving the classification.
const SNIPPET_LENGTH = 3000

function snippet(text) {
  return (text || '').slice(0, SNIPPET_LENGTH)
}

// Checks that the job-description text isn't actually a résumé, and that
// the résumé text isn't actually a job description — the two most common
// "wrong file in the wrong box" mistakes. One combined API call keeps this
// cheap and fast. Deliberately conservative: only flags a *confident*
// mismatch, so an unusual-but-real job posting (short, informal, missing
// a "Requirements" header) is never blocked. If the check itself fails for
// any reason, it fails open — generation proceeds rather than getting stuck
// on validation plumbing.
export async function checkDocumentTypes({ jobDescriptionText, resumeText }) {
  const fallback = { jobDescriptionLooksLikeResume: false, resumeLooksLikeJobDescription: false }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `You will see two texts: TEXT_A was submitted as a "job description" and TEXT_B was submitted as a "résumé". Check whether either was put in the wrong place.

Only answer "true" for a mismatch when you are confident — e.g. TEXT_A clearly belongs to one named individual with their own work history, education, and contact details (that's a résumé, not a job posting), or TEXT_B clearly reads as an employer's posting with role requirements and application instructions (that's a job description, not a résumé). If either text is short, informally written, or just unusual, but is still plausibly the right kind of document, answer "false" — do not guess.

Respond with ONLY this JSON object, no other text:
{"jobDescriptionLooksLikeResume": true|false, "resumeLooksLikeJobDescription": true|false}

TEXT_A (submitted as job description):
"""
${snippet(jobDescriptionText)}
"""

TEXT_B (submitted as résumé):
"""
${snippet(resumeText)}
"""`,
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
    }
  } catch (err) {
    console.error('checkDocumentTypes failed — proceeding without this check:', err)
    return fallback
  }
}