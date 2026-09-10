import fs from 'fs'
import path from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'ATS_Template_Tagged.docx')

export async function renderResumeDocx(tailored, { candidateName, address = '', phone = '', email = '' }) {
  const content = fs.readFileSync(TEMPLATE_PATH, 'binary')
  const zip = new PizZip(content)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

  doc.render({
    candidate_name: candidateName,
    address,
    phone,
    email,
    summary: tailored.summary,
    skills: tailored.skills.join(' | '),
    jobs: tailored.jobs.map(job => ({
      title: job.title,
      organization: job.organization,
      location: job.location,
      dates: job.dates,
      bullets: job.bullets,          // array of strings — becomes one bullet point each
    })),
    education: tailored.education,   // [{ degree, school, location }]
    certifications: tailored.certifications,
  })

  return doc.getZip().generate({ type: 'nodebuffer' })
}