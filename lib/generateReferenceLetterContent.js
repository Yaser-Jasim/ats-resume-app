import { anthropic } from './anthropic'

export async function generateReferenceLetterContent({ resumeText, jobDescription, positionTitle, orgName, candidateName }) {
  const systemPrompt = `You are drafting the body paragraphs of a professional recommendation letter. This draft will be given BY THE CANDIDATE to one of their real references (a former manager, colleague, or mentor) so that person can review, personalize, and sign it — you are not that reference, and you do not know them or their specific working history with the candidate.

Because of this, you must:
- Write in the third person about the candidate (e.g., "${candidateName} led...", not "I led...").
- Only describe skills, achievements, and experience that are actually present in the candidate's resume — never invent specific dates, projects, or working relationships you don't know are true.
- Tailor which achievements you highlight to what matters most for the specific job description provided.
- Include exactly ONE clearly bracketed placeholder like "[Add a specific example you personally observed that shows their judgment, communication, or leadership]" inviting the real reference to add a genuine personal anecdote — this is important, since a good recommendation letter needs at least one first-hand detail only the actual reference can provide.

Write exactly 2 short paragraphs, each just 2-3 sentences (the whole body should be under 120 words total). Every sentence needs to earn its place — professional and warm in tone, but tight. Avoid generic filler ("great team player," "hard worker") in favor of specific, resume-grounded strengths relevant to this role.

You must respond with ONLY valid JSON, no markdown fences, no commentary:
{ "paragraphs": string[] }`

  const userPrompt = `CANDIDATE: ${candidateName}
TARGET POSITION: ${positionTitle}
TARGET ORGANIZATION: ${orgName}

CANDIDATE'S RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Write the recommendation letter body paragraphs following all rules in the system prompt.`

    const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 2500,
    thinking: { type: 'disabled' },
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
    throw new Error('The letter got cut off before finishing — please try again.')
  }
}