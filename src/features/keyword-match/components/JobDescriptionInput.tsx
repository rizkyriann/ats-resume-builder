import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="job-description">Job Description</Label>
      <Textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here to see which keywords match your resume..."
        className="min-h-[150px]"
      />
    </div>
  )
}
