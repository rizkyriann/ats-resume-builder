import { useResumeStore } from '@/store/resumeStore'
import { EducationItemForm } from './EducationItemForm'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export function EducationList() {
  const education = useResumeStore((s) => s.resume.education)
  const addEducation = useResumeStore((s) => s.addEducation)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="qu-headline text-2xl uppercase tracking-wide">Education</h2>
        <p className="mt-1 text-sm">
          Add your educational background, starting with the most recent.
        </p>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <EducationItemForm key={edu.id} id={edu.id} index={index} />
        ))}
      </div>

      <Button onClick={addEducation} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}
