import { getPath } from 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'

PDFParse.setWorker(getPath())

export async function extractResumeText(file) {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === 'application/pdf') {
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const result = await parser.getText()
    await parser.destroy()
    return result.text
  }

  if (file.name.endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ buffer })
    return value
  }

  throw new Error('Unsupported file type — please upload a PDF or DOCX.')
}