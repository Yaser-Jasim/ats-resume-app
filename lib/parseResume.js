import { getPath } from 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'

PDFParse.setWorker(getPath())

async function extractPdfText(file) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const result = await parser.getText()
  await parser.destroy()
  return result.text
}

async function extractDocxText(file) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const { value } = await mammoth.extractRawText({ buffer })
  return value
}

// Used for both résumé and job description uploads — PDF or DOCX only.
// (Image/OCR support was removed: OCR transcription quality varied enough
// to shift scoring results, which undermined trust in the numbers more
// than it was worth. PDF/DOCX text extraction is exact, so scores stay
// consistent with what the user actually uploaded.)
export async function extractResumeText(file) {
  if (file.type === 'application/pdf') return extractPdfText(file)
  if (file.name.endsWith('.docx')) return extractDocxText(file)
  throw new Error('Unsupported file type — please upload a PDF or DOCX.')
}