import { getPath } from 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import { anthropic } from './anthropic'

PDFParse.setWorker(getPath())

// Anthropic's vision API only accepts these four image media types.
const ANTHROPIC_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

// Browsers/OSes sometimes report a JPEG as this non-standard type — normalize it.
function normalizeImageMediaType(type) {
  return type === 'image/jpg' ? 'image/jpeg' : type
}

function isSupportedImage(file) {
  return ANTHROPIC_IMAGE_TYPES.has(normalizeImageMediaType(file.type))
}

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

// Uses Claude's own vision capability to read text out of an image — this
// handles screenshots, photos of a printed posting, multi-column layouts,
// and mixed fonts far more reliably than a traditional OCR library, and
// it's the same API/billing this app already uses elsewhere.
async function extractTextFromImage(file) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const mediaType = normalizeImageMediaType(file.type)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: 'Transcribe every word of text visible in this image exactly as written — it is a job posting or job description. Preserve the original structure: headings, bullet points, and line breaks. Do not summarize, paraphrase, translate, or add any commentary of your own. Output ONLY the transcribed text, nothing else. If part of the image is blurry, cut off, or otherwise unreadable, transcribe everything else normally and write [illegible] in place of only that part.',
          },
        ],
      },
    ],
  })

  const textBlock = message.content.find(block => block.type === 'text')
  const text = textBlock?.text?.trim()
  if (!text) {
    throw new Error('Could not read any text from that image — please try a clearer image, or paste the text instead.')
  }
  return text
}

// Résumé uploads — unchanged behavior, PDF or DOCX only.
export async function extractResumeText(file) {
  if (file.type === 'application/pdf') return extractPdfText(file)
  if (file.name.endsWith('.docx')) return extractDocxText(file)
  throw new Error('Unsupported file type — please upload a PDF or DOCX.')
}

// General-purpose extraction — PDF, DOCX, or image (via OCR/vision). Used
// for the job description upload, and reusable anywhere else a file needs
// to become plain text.
export async function extractTextFromFile(file) {
  if (file.type === 'application/pdf') return extractPdfText(file)
  if (file.name.endsWith('.docx')) return extractDocxText(file)
  if (isSupportedImage(file)) return extractTextFromImage(file)
  throw new Error('Unsupported file type — please upload a PDF or image (PNG, JPG, or WEBP).')
}