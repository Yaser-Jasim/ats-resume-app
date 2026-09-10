export function buildDownloadFilename(candidateName, label) {
  const cleaned = (candidateName || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '') // strip characters that break Windows/Mac filenames
    .replace(/\s+/g, ' ')

  const base = cleaned ? `${cleaned} - ${label}` : label
  return `${base}.docx`
}

export function contentDispositionHeader(filename) {
  // ASCII-safe fallback for older systems, plus a UTF-8 version so accented
  // or non-Latin names (é, ñ, 王, etc.) still show up correctly.
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, "'")
  const encoded = encodeURIComponent(filename)
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}