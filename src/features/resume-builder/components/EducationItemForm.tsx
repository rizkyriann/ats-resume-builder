import { useResumeStore } from '@/store/resumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Education } from '@/types/resume'

interface EducationItemFormProps {
  id: string
  index: number
}

export function EducationItemForm({ id, index }: EducationItemFormProps) {
  const education = useResumeStore((s) => s.resume.education)
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)
  const reorderEducation = useResumeStore((s) => s.reorderEducation)

  const edu = education.find((e) => e.id === id)
  if (!edu) return null

  const handleChange = (field: keyof Omit<Education, 'id'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    updateEducation(id, { [field]: value })
  }

  const canMoveUp = index > 0
  const canMoveDown = index < education.length - 1

  return (
    <div className="qu-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold uppercase tracking-wide">Education #{index + 1}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderEducation(index, index - 1)}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderEducation(index, index + 1)}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => removeEducation(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`${id}-institution`}>Institution *</Label>
          <Input
            id={`${id}-institution`}
            value={edu.institution}
            onChange={handleChange('institution')}
            placeholder="Stanford University"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-degree`}>Degree *</Label>
            <Input
              id={`${id}-degree`}
              value={edu.degree}
              onChange={handleChange('degree')}
              placeholder="Bachelor of Science"
            />
          </div>
          <div>
            <Label htmlFor={`${id}-fieldOfStudy`}>Field of Study</Label>
            <Input
              id={`${id}-fieldOfStudy`}
              value={edu.fieldOfStudy}
              onChange={handleChange('fieldOfStudy')}
              placeholder="Computer Science"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`${id}-location`}>Location</Label>
          <Input
            id={`${id}-location`}
            value={edu.location}
            onChange={handleChange('location')}
            placeholder="Palo Alto, CA"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-startDate`}>Start Date</Label>
            <Input
              id={`${id}-startDate`}
              type="month"
              value={edu.startDate}
              onChange={handleChange('startDate')}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-endDate`}>End Date</Label>
            <Input
              id={`${id}-endDate`}
              type="month"
              value={edu.endDate || ''}
              onChange={handleChange('endDate')}
              disabled={edu.isCurrent}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id={`${id}-isCurrent`}
                checked={edu.isCurrent}
                onChange={handleChange('isCurrent')}
                className="h-4 w-4"
              />
              <Label htmlFor={`${id}-isCurrent`} className="cursor-pointer font-normal">
                I currently study here
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor={`${id}-description`}>Description (Optional)</Label>
          <Textarea
            id={`${id}-description`}
            value={edu.description}
            onChange={handleChange('description')}
            placeholder="GPA: 3.8/4.0&#10;Honors: Dean's List"
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
}
