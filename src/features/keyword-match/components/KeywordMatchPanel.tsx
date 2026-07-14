import { useState } from 'react'
import { JobDescriptionInput } from './JobDescriptionInput'
import { KeywordMatchResults } from './KeywordMatchResults'

export function KeywordMatchPanel() {
  const [jobDescription, setJobDescription] = useState('')

  return (
    <div className="qu-card-elevated p-6">
      <div className="mb-4">
        <h2 className="qu-headline text-lg uppercase tracking-wide text-qu-gold">
          Keyword Match
        </h2>
        <p className="mt-1 text-sm text-qu-text-muted">
          Compare your resume against a specific job description
        </p>
      </div>

      <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
      <KeywordMatchResults jobDescription={jobDescription} />
    </div>
  )
}
