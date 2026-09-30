'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { UploadCloud, FileText } from 'lucide-react'

function FileDropZone({ file, setFile, accept, hint }) {
  const onDrop = useCallback(files => setFile(files[0]), [setFile])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxFiles: 1 })
  return (
    <div {...getRootProps()}
         className={`mt-1.5 mb-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
           ${isDragActive ? 'border-brand bg-mist' : 'border-gray-200 hover:border-gray-300 hover:bg-mist/50'}`}>
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center justify-center gap-2 text-ink text-sm">
          <FileText className="w-4 h-4 text-brand" />
          {file.name}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <UploadCloud className="w-6 h-6" />
          <p className="text-sm">{hint}</p>
        </div>
      )}
    </div>
  )
}

const RESUME_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const JOB_DESCRIPTION_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

export default function MainPage() {
  const router = useRouter()
  const [positionTitle, setPositionTitle] = useState('')
  const [orgName, setOrgName] = useState('')
  const [orgAddress, setOrgAddress] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onDropJobDescription = useCallback(files => setJobDescriptionFile(files[0]), [])
  const { getInputProps: getJobDescriptionInputProps, open: openJobDescriptionPicker } = useDropzone({
    onDrop: onDropJobDescription,
    accept: JOB_DESCRIPTION_ACCEPT,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  })

  async function handleGenerate() {
    setLoading(true)
    setErrorMsg('')

    if (!positionTitle.trim()) {
      setErrorMsg('Please enter the position title.')
      setLoading(false)
      return
    }
    if (!orgName.trim()) {
      setErrorMsg('Please enter the organization name.')
      setLoading(false)
      return
    }
    if (!jobDescriptionFile && !jobDescription.trim()) {
      setErrorMsg('Please upload or paste the job description.')
      setLoading(false)
      return
    }
    if (!resumeFile && !resumeText.trim()) {
      setErrorMsg('Please upload or paste a résumé.')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('positionTitle', positionTitle)
    formData.append('orgName', orgName)
    formData.append('orgAddress', orgAddress)
    formData.append('jobDescription', jobDescription)
    if (jobDescriptionFile) formData.append('jobDescriptionFile', jobDescriptionFile)
    if (resumeFile) formData.append('resumeFile', resumeFile)
    if (resumeText) formData.append('resumeText', resumeText)

    const res = await fetch('/api/generate', { method: 'POST', body: formData })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setErrorMsg(data.error || 'Something went wrong.')
    router.push(`/result/${data.generationId}`)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10 max-w-2xl">
        <BackButton />
        <h1 className="font-display text-3xl text-ink mb-1.5">Tailor your résumé to this job</h1>
        <p className="text-sm text-gray-500 mb-8">Paste the posting, add your résumé, and get a version built for it in under a minute.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-ink">Position title <span className="text-red-500">*</span></label>
            <Input className="mt-1.5" placeholder="e.g. Senior Product Manager"
                   value={positionTitle} onChange={e => setPositionTitle(e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-ink">Organization name <span className="text-red-500">*</span></label>
            <Input className="mt-1.5" placeholder="e.g. Acme Inc."
                   value={orgName} onChange={e => setOrgName(e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-ink">Org. address (optional)</label>
            <Input className="mt-1.5" placeholder="e.g. 123 Main St, City"
                   value={orgAddress} onChange={e => setOrgAddress(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-1.5">
          <label className="text-sm font-medium text-ink">1 — Upload job description (PDF or DOCX)</label>
          <Button type="button" onClick={openJobDescriptionPicker}>
            Upload
          </Button>
          <input {...getJobDescriptionInputProps()} />
        </div>
        {jobDescriptionFile && (
          <div className="flex items-center gap-2 text-ink text-sm mb-4">
            <FileText className="w-4 h-4 text-brand" />
            {jobDescriptionFile.name}
          </div>
        )}

        <label className="text-sm font-medium text-ink">2 — or / paste job description</label>
        <Textarea className="h-40 mt-1.5 mb-6"
                  value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  disabled={!!jobDescriptionFile}
                  placeholder="Paste the job posting text here instead" />

        <label className="text-sm font-medium text-ink">1 — Upload résumé</label>
        <FileDropZone
          file={resumeFile}
          setFile={setResumeFile}
          accept={RESUME_ACCEPT}
          hint="Drop a PDF or DOCX here, or click to browse"
        />

        <label className="text-sm font-medium text-ink">2 — or / paste résumé</label>
        <Textarea className="h-32 mt-1.5 mb-6"
                  value={resumeText} onChange={e => setResumeText(e.target.value)}
                  disabled={!!resumeFile} placeholder="Paste your resume text here instead" />

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        <div className="flex justify-end">
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </div>
      </main>
    </div>
  )
}