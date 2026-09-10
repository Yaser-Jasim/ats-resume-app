'use client'
import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabaseClient'
import { UploadCloud, FileText } from 'lucide-react'

function FileDrop({ label, file, setFile }) {
  const onDrop = useCallback(files => setFile(files[0]), [setFile])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  })
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <div {...getRootProps()}
           className={`mt-1.5 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
             ${isDragActive ? 'border-brand bg-mist' : 'border-gray-200 hover:border-gray-300 hover:bg-mist/50'}`}>
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-ink text-sm">
            <FileText className="w-4 h-4 text-brand" />
            {file.name}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <UploadCloud className="w-5 h-5" />
            <p className="text-sm">Drop a PDF or DOCX here, or click to browse</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HRPage() {
  const router = useRouter()
  const supabase = createClient()
  const [checking, setChecking] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  const [jobTitle, setJobTitle] = useState('')
  const [orgName, setOrgName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setChecking(false); return }
      setLoggedIn(true)
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      setHasAccess(profile?.plan === 'hr')
      setChecking(false)
    }
    check()
  }, [])

  async function handleAnalyze() {
    setLoading(true)
    setErrorMsg('')

    if (!jobDescription || !resumeFile) {
      setErrorMsg('Job description and candidate resume are both required.')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('jobTitle', jobTitle)
    formData.append('orgName', orgName)
    formData.append('jobDescription', jobDescription)
    formData.append('resumeFile', resumeFile)
    if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile)

    const res = await fetch('/api/hr-analyze', { method: 'POST', body: formData })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setErrorMsg(data.error || 'Something went wrong.')
    router.push(`/hr/result/${data.evaluationId}`)
  }

  if (checking) {
    return <div className="flex"><Sidebar /><main className="p-8"><BackButton /><p className="text-sm text-gray-500">Loading…</p></main></div>
  }

  if (!loggedIn) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="p-8">
          <BackButton />
          <p className="text-sm">Please <a href="/login" className="text-brand underline">log in</a> to use this feature.</p>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 mx-auto p-8 max-w-lg">
          <BackButton />
          <h1 className="font-display text-2xl text-ink mb-2">For HR Managers</h1>
          <p className="text-sm text-gray-600 mb-6">
            Screen candidates against a job posting in seconds — ATS score, manager-fit score, strengths, weaknesses,
            missing requirements, and a downloadable assessment report. This is included with the HR / Recruiter plan.
          </p>
          <Button onClick={() => router.push('/account/plans')}>View the HR / Recruiter plan</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <BackButton />
        <h1 className="font-display text-2xl text-ink mb-1">For HR Managers</h1>
        <p className="text-sm text-gray-600 mb-6">Upload a candidate's resume (and cover letter, if you have one) alongside the job posting — you'll get an ATS score, a manager-fit score, and a breakdown of strengths, gaps, and anything worth double-checking before an interview.</p>

        <div className="flex gap-4 mb-4">
          <Input placeholder="Job title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          <Input placeholder="Organization name" value={orgName} onChange={e => setOrgName(e.target.value)} />
        </div>

        <label className="text-sm font-medium text-ink">Job description / requirements</label>
        <Textarea className="h-32 mt-1.5 mb-6" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />

        <div className="mb-6">
          <FileDrop label="Candidate's résumé (required)" file={resumeFile} setFile={setResumeFile} />
        </div>

        <div className="mb-6">
          <FileDrop label="Candidate's cover letter (optional)" file={coverLetterFile} setFile={setCoverLetterFile} />
        </div>

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze Candidate'}
          </Button>
        </div>
      </main>
    </div>
  )
}