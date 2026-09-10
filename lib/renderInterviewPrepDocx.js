import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, color: '1F3864' })],
  })
}

function body(text, opts = {}) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 }, children: [new TextRun({ text, ...opts })] })
}

export async function renderInterviewPrepDocx({ candidateName, positionTitle, orgName, prep }) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Interview Prep', bold: true, size: 36, color: '1F3864' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: `${candidateName} — ${positionTitle} at ${orgName}`, size: 22, color: '666666' })],
    }),

    heading('Your Quick Pitch'),
    body(prep.quick_pitch),

    heading('Likely Questions & How to Answer Them'),
  ]

  prep.likely_questions?.forEach((q, i) => {
    children.push(body(`${i + 1}. ${q.question}`, { bold: true }))
    children.push(body(`Why they ask this: ${q.why_asked}`, { italics: true, size: 20 }))
    children.push(body(`Approach: ${q.approach}`))
    children.push(body(`Example answer: ${q.example_answer}`, { color: '333333' }))
  })

  children.push(heading('Behavioral Scenarios (STAR Method)'))
  prep.behavioral_scenarios?.forEach((s, i) => {
    children.push(body(`${i + 1}. "${s.scenario_prompt}"`, { bold: true }))
    children.push(body(s.framework_tip, { italics: true, size: 20 }))
    children.push(body(`Example answer: ${s.example_answer}`, { color: '333333' }))
  })

  children.push(heading('Smart Questions to Ask Your Interviewer'))
  prep.questions_to_ask?.forEach(q => children.push(body(`•  ${q}`)))

  children.push(heading('Staying Calm'))
  prep.stress_tips?.forEach(t => children.push(body(`•  ${t}`)))

  children.push(new Paragraph({
    spacing: { before: 400 },
    children: [new TextRun({
      text: 'This is AI-generated preparation material to help you think through likely questions — not a script to memorize. Speak naturally, in your own words.',
      italics: true, size: 18, color: '666666',
    })],
  }))

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBuffer(doc)
}