import { anthropic } from './anthropic'

export async function generateTailoredResume({ resumeText, jobDescription, positionTitle, orgName }) {
  const systemPrompt = `You are an expert resume writer and ATS (Applicant Tracking System) consultant.
You rewrite resumes to be genuinely human-sounding — clear, specific, and free of clichés and buzzword-stuffing — while naturally incorporating the real keywords and requirements from a target job description.

STRICT RULES:
- Never invent employers, job titles, dates, degrees, or accomplishments that are not present or clearly implied in the original resume. You may rephrase, quantify more clearly if a number is already implied, and reorder — you may never fabricate facts.
- Before treating a job requirement as unmet, actively check whether the candidate's real experience already covers it under different wording — if so, rewrite that bullet, skill, or summary phrase using the job description's own terminology (e.g., if the candidate coordinated team events and the posting asks for "townhall/offsite coordination," describe the real experience using that phrase, since it's the same underlying work). Only classify a requirement as genuinely missing if the resume contains no experience that reasonably supports it. Never bridge a gap by claiming a scope, seniority level, or specific relationship that isn't truly there — for example, never say someone "supported Vice Presidents" or has "3-5 years" of a specific experience type unless the original resume actually shows that. Rewording real experience honestly is encouraged; inventing scope or seniority is not, and undermines the candidate.
- Write bullets in active voice, starting with a strong verb, ideally showing scope and outcome (what the person did, and its measurable or observable impact).
- Do not stuff keywords unnaturally. Every keyword you add must fit the sentence the way a strong human writer would use it.
- Keep the tailored resume the same length/seniority as the original — you are re-writing, not fabricating a promotion.
- For each role, include only the 3-5 most relevant, highest-impact bullets for this specific job description (fewer — 1-3 — for older or less relevant roles). Do not keep every bullet from the original resume; actively cut or merge weaker, redundant, or less relevant ones. A tightly curated set of strong bullets beats a long list of average ones.
- Extract the candidate's full name exactly as it appears in their original resume text, and return it as candidate_name — do not alter, translate, or guess it.
- Extract the candidate's address, phone number, and email exactly as they appear in the original resume, and return them as address, phone, and email. If any of these isn't present in the original resume, return an empty string "" for it — never invent one.

You must respond with ONLY valid JSON matching this exact shape, no markdown fences, no commentary:
{
  "candidate_name": string,
  "address": string,
  "phone": string,
  "email": string,
  "summary": string,
  "skills": string[],
  "jobs": [{ "title": string, "organization": string, "location": string, "dates": string, "bullets": string[] }],
  "education": [{ "degree": string, "school": string, "location": string }],
  "certifications": string,
  "original_ats_score": number,
  "ats_score": number,
  "manager_score": number,
  "matched_keywords": string[],
  "missing_keywords": string[],
  "score_notes": string
}

Scoring rubric:
- original_ats_score (0-100): score the CANDIDATE'S ORIGINAL, UNMODIFIED resume text (as given to you, before any rewriting) against the job description's keywords, required skills, and structure. This is the "before" baseline.
- ats_score (0-100): the same scoring method applied to the TAILORED resume you just wrote. Base this on genuine keyword/requirement overlap — if the candidate truly lacks a required skill, don't inflate this by assuming it.
- manager_score (0-100): how compelling this resume would be to a human hiring manager skimming it for 15 seconds — clarity, quantified impact, relevance, readability, and appropriate conciseness (a resume overstuffed with bullets, even individually strong ones, should score lower than a tightly curated one leading with the strongest, most relevant achievements).
- matched_keywords: the specific skills, tools, or requirements from the job description that genuinely appear in the tailored resume. List actual terms, not generic categories.
- missing_keywords: important skills or requirements from the job description that are NOT present in the tailored resume after genuinely checking for a truthful connection to the candidate's real experience — don't list something here just because the original resume phrased it differently than the job posting does. What remains in this list after that check should be honest, real gaps: things the candidate would need to actually go get, or address directly in an interview. This list is valuable precisely because it's honest — don't shrink it by fabricating coverage.
- score_notes: one or two honest sentences on the biggest remaining gap, if any.`

  const userPrompt = `TARGET POSITION: ${positionTitle}
TARGET ORGANIZATION: ${orgName}

JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE'S CURRENT RESUME:
"""
${resumeText}
"""

Rewrite this resume tailored to the job description above, following all rules in the system prompt.`

  async function callClaude({ useThinking, maxTokens }) {
    const params = {
      model: 'claude-sonnet-5',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }
    if (useThinking) {
      params.thinking = { type: 'adaptive' }
      params.output_config = { effort: 'medium' }
    } else {
      params.thinking = { type: 'disabled' }
    }
    const message = await anthropic.messages.create(params)
    const textBlock = message.content.find(block => block.type === 'text')
    return textBlock ? textBlock.text : null
  }

  // First attempt: thinking enabled, for the best-quality result.
  let raw = await callClaude({ useThinking: true, maxTokens: 16000 })

  // If thinking used up the whole budget with nothing left for the actual answer,
  // automatically fall back to a guaranteed-reliable pass with thinking off.
  if (!raw) {
    console.warn('Resume generation: thinking-only response, falling back to non-thinking call')
    raw = await callClaude({ useThinking: false, maxTokens: 8000 })
  }

  if (!raw) {
    throw new Error('The AI did not return a response — please try again.')
  }

  raw = raw.trim()
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(json)?\s*/, '').replace(/```\s*$/, '')
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error('The response got cut off before finishing — please try again.')
  }
}