import { anthropic } from './anthropic'

export async function generateInterviewPrep({ resumeText, jobDescription, positionTitle, orgName, candidateName, tailoredSummary }) {
  const systemPrompt = `You are an experienced interview coach preparing a candidate for a real interview. Ground every suggested answer in the candidate's ACTUAL resume — never invent achievements, employers, or numbers they don't have. Suggested answers are starting points for the candidate to personalize in their own words, not scripts to memorize word-for-word.

You must respond with ONLY valid JSON matching this exact shape, no markdown fences, no commentary:
{
  "quick_pitch": string,
  "likely_questions": [{ "question": string, "why_asked": string, "approach": string, "example_answer": string }],
  "behavioral_scenarios": [{ "scenario_prompt": string, "framework_tip": string, "example_answer": string }],
  "questions_to_ask": string[],
  "stress_tips": string[]
}

Field guidance:
- quick_pitch: a natural, 30-45-second spoken "tell me about yourself" answer, built from the candidate's real background and tailored toward this specific role.
- likely_questions: 7 questions this candidate will realistically be asked for this specific role — mix universal ones (e.g. strengths/weaknesses, why this role) with 3-4 questions built directly from specific requirements in the job description. For each: why_asked explains what the interviewer is actually evaluating, approach gives a short strategy, example_answer is a real-sounding draft grounded in the candidate's actual resume.
- behavioral_scenarios: 4 "tell me about a time..." style prompts most likely for this role, each with framework_tip explicitly referencing the STAR method (Situation, Task, Action, Result) and example_answer built from a real, specific moment already implied in the resume — if the resume doesn't clearly contain a fitting example for a strong scenario, choose a different scenario instead of inventing one.
- questions_to_ask: 5 specific, genuinely insightful questions the candidate could ask the interviewer — tied to the actual job description and organization where possible, not generic filler like "what's the culture like."
- stress_tips: 5 concrete, actionable tips for managing pre-interview nerves — practical techniques (breathing, preparation habits, reframing, logistics), never vague reassurance like "just be yourself."`

  const userPrompt = `CANDIDATE: ${candidateName}
TARGET POSITION: ${positionTitle}
TARGET ORGANIZATION: ${orgName}

CANDIDATE'S TAILORED RESUME SUMMARY:
"""
${tailoredSummary}
"""

FULL ORIGINAL RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Build the full interview prep package following all rules in the system prompt.`

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

  let raw = await callClaude({ useThinking: true, maxTokens: 16000 })
  if (!raw) {
    console.warn('Interview prep: thinking-only response, falling back to non-thinking call')
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