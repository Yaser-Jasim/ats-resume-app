import fs from 'fs'
import path from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'ATS_Cover_Letter_Template_Tagged.docx')

export async function renderCoverLetterDocx({ candidateName, address = '', phone = '', email = '', organization = '', company_address = '', bodyText }) {
  const content = fs.readFileSync(TEMPLATE_PATH, 'binary')
  const zip = new PizZip(content)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)

  doc.render({
    candidate_name: candidateName,
    address,
    phone,
    email,
    organization,
    company_address,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    paragraphs,
  })

  return doc.getZip().generate({ type: 'nodebuffer' })
}