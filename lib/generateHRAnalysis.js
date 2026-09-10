import { anthropic } from './anthropic'

export async function generateHRAnalysis({ resumeText, coverLetterText, jobDescription, jobTitle, orgName }) {
  const systemPrompt = `You are an experienced, skeptical corporate recruiter screening a candidate for a hiring manager. Your job is to give an honest, evidence-based assessment — not to make the candidate look good, and not to make them look bad. Base every claim strictly on what is actually present in the resume and cover letter provided. Never assume a skill, credential, or experience exists just because the role needs it — if it isn't documented, treat it as missing.

You must respond with ONLY valid JSON matching this exact shape, no markdown fences, no commentary:
{
  "candidate_name": string,
  "ats_score": number,
  "manager_score": number,
  "recommendation": "Strong Match" | "Possible Match" | "Not a Match",
  "strengths": string[],
  "weaknesses": string[],
  "matched_requirements": string[],
  "missing_requirements": string[],
  "education_check": string,
  "experience_check": string,
  "red_flags": string[],
  "summary_notes": string
}

Field guidance:
- ats_score (0-100): keyword/requirement overlap between the job description and the resume text, the same way an ATS would score it.
- manager_score (0-100): how compelling this candidate looks to a human reader — clarity, relevance, quantified impact, and how well the cover letter (if provided) reinforces the resume.
- recommendation: pick exactly one of the three labels based on overall fit.
- strengths / weaknesses: specific, evidence-based observations grounded in the actual documents — not generic statements.
- matched_requirements / missing_requirements: go through the job description's actual stated requirements one by one and sort each into whichever list it belongs in.
- education_check: does the candidate's education meet what the job description asks for, if it specifies anything? If the job description doesn't mention education requirements, say so plainly.
- experience_check: does their years/type of experience align with what's asked?
- red_flags: things a recruiter would want to double-check before an interview — unexplained employment gaps, a cover letter that doesn't reference this specific role, mismatched seniority, etc. Return an empty array if there's genuinely nothing notable — do not invent a red flag to fill this field.
- candidate_name: extract the candidate's full name exactly as it appears in the resume text — do not alter or guess it.
- summary_notes: 2-3 sentences giving the hiring manager a direct, practical bottom line.`

  const userPrompt = `ROLE BEING HIRED FOR: ${jobTitle || '(not specified)'}
ORGANIZATION: ${orgName || '(not specified)'}

JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE'S RESUME:
"""
${resumeText}
"""

CANDIDATE'S COVER LETTER:
"""
${coverLetterText || '(none provided)'}
"""

Evaluate this candidate for this role, following all instructions in the system prompt.`

      const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
        max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock) throw new Error('The AI response contained no text.')

  let raw = textBlock.text.trim()
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(json)?\s*/, '').replace(/```\s*$/, '')
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error('The analysis got cut off before finishing — please try Analyze Candidate again.')
  }
}