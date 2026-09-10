import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'

const PLACEHOLDER_COLOR = 'B36B00'
function ph(text) {
  return new TextRun({ text, italics: true, bold: true, color: PLACEHOLDER_COLOR })
}

export async function renderReferenceLetterDocx({ candidateName, positionTitle, orgName, paragraphs }) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [ph('[Reference Name]')] }),
        new Paragraph({ children: [ph('[Reference Title]')] }),
        new Paragraph({ children: [ph('[Reference Company]')] }),
        new Paragraph({ spacing: { after: 300 }, children: [ph('[Reference Phone]'), new TextRun(' | '), ph('[Reference Email]')] }),

        new Paragraph({ spacing: { after: 300 }, children: [ph('[Date]')] }),

        new Paragraph({ text: 'Hiring Manager' }),
        new Paragraph({ spacing: { after: 300 }, text: orgName || '[Organization Name]' }),

        new Paragraph({ spacing: { after: 300 }, text: 'Dear Hiring Manager,' }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun(`I am writing to recommend ${candidateName} for the ${positionTitle} position at ${orgName}. I had the opportunity to work with ${candidateName} as their `),
            ph('[your relationship, e.g. manager, colleague]'),
            new TextRun(' at '),
            ph('[company where you worked together]'),
            new TextRun(', and I am confident they would be a strong addition to your team.'),
          ],
        }),

        ...paragraphs.map(text => new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [new TextRun(text)],
        })),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [new TextRun(`Please feel free to contact me directly if you have any questions or would like to discuss ${candidateName}'s qualifications further.`)],
        }),

        new Paragraph({ text: 'Sincerely,' }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [ph('[Reference Name]')] }),
        new Paragraph({ children: [ph('[Reference Title]')] }),
        new Paragraph({ children: [ph('[Reference Company]')] }),
      ],
    }],
  })
  return Packer.toBuffer(doc)
}