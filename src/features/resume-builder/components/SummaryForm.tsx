import { useForm } from 'react-hook-form'
import { useResumeStore } from '@/store/resumeStore'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary)
  const updateSummary = useResumeStore((s) => s.updateSummary)

  const { register } = useForm({
    defaultValues: { summary },
  })

  const wordCount = summary.split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="qu-headline text-2xl uppercase tracking-wide">
          Professional Summary
        </h2>
        <p className="mt-1 text-sm">
          A brief overview of your professional background and key strengths.
        </p>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          {...register('summary')}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSummary(e.target.value)}
          placeholder="Experienced software engineer with 5+ years building scalable web applications..."
          className="min-h-[150px]"
        />
        <p className="mt-1 text-xs text-qu-text-muted">
          {wordCount} words (recommended: 40-60 words)
        </p>
      </div>
    </div>
  )
}
