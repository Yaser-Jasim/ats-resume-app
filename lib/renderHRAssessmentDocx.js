import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

function bulletList(items) {
  if (!items || items.length === 0) {
    return [new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: 'None noted.', italics: true })] })]
  }
  return items.map(item => new Paragraph({ text: item, bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED }))
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    children: [new TextRun({ text, bold: true, color: '1F3864' })],
  })
}

const REC_COLORS = {
  'Strong Match': '2E7D32',
  'Possible Match': 'B36B00',
  'Not a Match': 'C62828',
}

export async function renderHRAssessmentDocx({ candidateName, jobTitle, orgName, atsScore, managerScore, result }) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${candidateName || 'Candidate'} Evaluation`, bold: true, size: 36, color: '1F3864' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: `${jobTitle || 'Role'}${orgName ? ' at ' + orgName : ''}`, size: 24 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: `ATS Score: ${atsScore}%`, bold: true, size: 22 }),
            new TextRun({ text: '   |   ', size: 22 }),
            new TextRun({ text: `Manager Hit: ${managerScore}%`, bold: true, size: 22 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({
            text: result.recommendation,
            bold: true,
            size: 24,
            color: REC_COLORS[result.recommendation] || '333333',
          })],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [new TextRun({ text: result.summary_notes || '' })],
        }),

        sectionHeading('Strengths'),
        ...bulletList(result.strengths),

        sectionHeading('Weaknesses'),
        ...bulletList(result.weaknesses),

        sectionHeading('Matched Requirements'),
        ...bulletList(result.matched_requirements),

        sectionHeading('Missing Requirements'),
        ...bulletList(result.missing_requirements),

        sectionHeading('Education'),
        new Paragraph({ text: result.education_check || 'Not assessed.', alignment: AlignmentType.JUSTIFIED }),

        sectionHeading('Experience'),
        new Paragraph({ text: result.experience_check || 'Not assessed.', alignment: AlignmentType.JUSTIFIED }),

        ...(result.red_flags && result.red_flags.length > 0 ? [
          sectionHeading('Worth Double-Checking'),
          ...bulletList(result.red_flags),
        ] : []),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 400 },
          children: [new TextRun({ text: 'This is an AI-generated estimate to support, not replace, human judgment in the hiring process.', italics: true, size: 18, color: '666666' })],
        }),
      ],
    }],
  })
  return Packer.toBuffer(doc)
}