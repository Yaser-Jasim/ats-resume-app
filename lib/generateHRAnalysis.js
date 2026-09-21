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

Important: the cover letter is optional. If the candidate did not submit one, treat that as completely neutral — it must never lower any score, count as a weakness, or appear as a red flag. Only evaluate a cover letter's content if one was actually provided, and even then, treat it as supporting context alongside the resume, never as a requirement.

Field guidance:
- ats_score (0-100): keyword/requirement overlap between the job description and the resume text, the same way an ATS would score it.
- manager_score (0-100): how compelling this candidate looks to a human reader, based on the resume — clarity, relevance, quantified impact. A cover letter, if provided and strong, may support this score, but a missing or weak one must never lower it.
- recommendation: pick exactly one of the three labels based on overall fit with the resume and job description. A missing cover letter must never be a reason to downgrade this recommendation.
- strengths / weaknesses: specific, evidence-based observations grounded in the actual documents — not generic statements. Not having a cover letter is never a weakness, since it's optional.
- matched_requirements / missing_requirements: go through the job description's actual stated requirements one by one and sort each into whichever list it belongs in.
- education_check: does the candidate's education meet what the job description asks for, if it specifies anything? If the job description doesn't mention education requirements, say so plainly.
- experience_check: does their years/type of experience align with what's asked?
- red_flags: things a recruiter would want to double-check before an interview — unexplained employment gaps, mismatched seniority, or (only if a cover letter was actually submitted) one that doesn't reference this specific role. A missing cover letter is never a red flag on its own. Return an empty array if there's genuinely nothing notable — do not invent a red flag to fill this field.
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