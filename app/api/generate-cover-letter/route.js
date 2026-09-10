import { NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export async function POST(req) {
  const routeClient = await createRouteClient()
  const { data: { user } } = await routeClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
  }

  const { generationId } = await req.json()
  const supabase = createServerClient()
  const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()

  if (!gen || gen.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

    const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 3000,
    thinking: { type: 'disabled' },
        system: `You write cover letters that sound like a real person wrote them in one sitting — not like an AI trying to sound impressive. A hiring manager should never suspect this was AI-generated.

Ground every sentence in the candidate's ACTUAL tailored resume — never invent achievements, and never write generic claims the candidate can't back up.

Write exactly 3 short paragraphs, separated by a single blank line (so paragraph breaks are unambiguous):
1. Open with something specific — a real detail from the job posting or company that actually caught the candidate's attention. Never open with "I am writing to express my interest" or "I am excited to apply for."
2. Connect ONE or TWO of the candidate's real, specific accomplishments (with numbers where the resume has them) directly to what this role needs. Show the connection, don't just list qualifications.
3. A short, low-key close. Not "I look forward to hearing from you" — say something more specific and human, like naming what you'd want to talk through first.

Hard rules on voice:
- Vary sentence length on purpose — mix a short sentence with longer ones. Uniform, evenly-sized sentences are the single biggest tell of AI writing.
- Never use: "leverage," "passionate," "dynamic," "proven track record," "fast-paced environment," "great fit," "furthermore," "moreover," "I believe," "in today's."
- Don't structure every paragraph the same way (topic sentence + 3 supporting points + conclusion) — real people don't write that symmetrically.
- No triple lists ("X, Y, and Z") unless the resume itself has exactly three matching items — this pattern is heavily overused by AI.
- Contractions are fine and often make it sound more human ("I've," "I'm," "didn't").
- Never use ANY dash character to join two clauses — not an em dash (—), not an en dash (–), and not a hyphen with spaces around it ( - ). This applies no matter which dash character you reach for. Instead, always rewrite as two full sentences, or connect them with "and," "but," "so," "because," or a comma.
  WRONG: "I managed the payroll process - handling everything from onboarding to compliance."
  RIGHT: "I managed the payroll process, handling everything from onboarding to compliance." (or split into two sentences)
- A hyphen is only ever acceptable inside a single compound word (like "full-cycle" or "cross-functional"), never with spaces on both sides.
- Total length: 150-250 words. Real cover letters are short; padding is another AI tell.

Return plain text only — no markdown, no headers, no salutation ("Dear Hiring Manager,") or sign-off ("Best regards,") since those are already in the template. Just the 3 body paragraphs.`,
    messages: [{
      role: 'user',
      content: `JOB DESCRIPTION:\n${gen.job_description}\n\nTAILORED RESUME (JSON):\n${JSON.stringify(gen.tailored_json)}\n\nWrite the cover letter body (no address block, no salutation needed — just the body paragraphs).`,
    }],
  })

  const coverLetter = message.content[0].text
  await supabase.from('generations').update({ cover_letter: coverLetter }).eq('id', generationId)

  return NextResponse.json({ coverLetter })
}