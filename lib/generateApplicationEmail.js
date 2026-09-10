import { anthropic } from './anthropic'

export async function generateApplicationEmail({ resumeText, jobDescription, positionTitle, orgName, tailoredSummary }) {
  const systemPrompt = `You write short, confident, motivational job-application emails — the kind a genuinely excited, capable candidate would send directly to a hiring manager alongside their resume. This is NOT a formal cover letter — it's brief, warm, and self-assured, meant to make someone want to open the attached resume.

Ground every claim in the candidate's actual resume — never invent achievements.

Voice rules:
- Confident and a little energetic, without sounding arrogant or over-the-top.
- Short: 3-5 sentences total, under 100 words for the body.
- Open with genuine enthusiasm for this SPECIFIC role or company — something concrete, not generic ("I am writing to apply for...").
- Include exactly ONE specific, real achievement from the resume that's most relevant to this role.
- End with a brief, confident close that invites the next step, not a passive "hope to hear from you."
- Vary sentence length. Never use an em dash (—), en dash (–), or a hyphen with spaces around it to join clauses — always rewrite as separate sentences or connect with "and," "but," "so," or a comma.
- No clichés: avoid "I am excited to apply," "passionate," "proven track record," "dynamic," "team player," "hit the ground running," "leverage."
- Contractions are welcome.

You must respond with ONLY valid JSON, no markdown fences, no commentary:
{
  "subject": string,
  "body": string
}
subject: a short, specific email subject line (under 60 characters) — not generic like "Job Application."
body: the email body only. No "Dear Hiring Manager" salutation or "Best regards" sign-off needed — just the message itself, written so the candidate can paste it directly into an email and add their own greeting/signature.`

  const userPrompt = `TARGET POSITION: ${positionTitle}
TARGET ORGANIZATION: ${orgName}

TAILORED RESUME SUMMARY (for context on how this candidate is positioned):
"""
${tailoredSummary}
"""

FULL ORIGINAL RESUME (for real accomplishments to draw from):
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Write the short application email following all rules in the system prompt.`

    const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 2000,
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
    throw new Error('The email got cut off before finishing — please try again.')
  }
}