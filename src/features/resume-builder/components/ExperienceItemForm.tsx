import { useResumeStore } from '@/store/resumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Experience } from '@/types/resume'

interface ExperienceItemFormProps {
  id: string
  index: number
}

export function ExperienceItemForm({ id, index }: ExperienceItemFormProps) {
  const experience = useResumeStore((s) => s.resume.experience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const reorderExperience = useResumeStore((s) => s.reorderExperience)

  const exp = experience.find((e) => e.id === id)
  if (!exp) return null

  const handleChange = (field: keyof Omit<Experience, 'id'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    updateExperience(id, { [field]: value })
  }

  const canMoveUp = index > 0
  const canMoveDown = index < experience.length - 1

  return (
    <div className="qu-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold uppercase tracking-wide">Experience #{index + 1}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderExperience(index, index - 1)}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderExperience(index, index + 1)}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => removeExperience(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-company`}>Company *</Label>
            <Input
              id={`${id}-company`}
              value={exp.company}
              onChange={handleChange('company')}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <Label htmlFor={`${id}-position`}>Position *</Label>
            <Input
              id={`${id}-position`}
              value={exp.position}
              onChange={handleChange('position')}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`${id}-location`}>Location</Label>
          <Input
            id={`${id}-location`}
            value={exp.location}
            onChange={handleChange('location')}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-startDate`}>Start Date</Label>
            <Input
              id={`${id}-startDate`}
              type="month"
              value={exp.startDate}
              onChange={handleChange('startDate')}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-endDate`}>End Date</Label>
            <Input
              id={`${id}-endDate`}
              type="month"
              value={exp.endDate || ''}
              onChange={handleChange('endDate')}
              disabled={exp.isCurrent}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id={`${id}-isCurrent`}
                checked={exp.isCurrent}
                onChange={handleChange('isCurrent')}
                className="h-4 w-4"
              />
              <Label htmlFor={`${id}-isCurrent`} className="cursor-pointer font-normal">
                I currently work here
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor={`${id}-description`}>Description</Label>
          <Textarea
            id={`${id}-description`}
            value={exp.description}
            onChange={handleChange('description')}
            placeholder="• Led development of new features&#10;• Improved performance by 40%&#10;• Mentored junior engineers"
            className="min-h-[120px]"
          />
          <p className="mt-1 text-xs text-qu-text-muted">
            Use bullet points (one per line) to describe your achievements and responsibilities
          </p>
        </div>
      </div>
    </div>
  )
}
