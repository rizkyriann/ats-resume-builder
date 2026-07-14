import { useResumeStore } from '@/store/resumeStore'
import { ExperienceItemForm } from './ExperienceItemForm'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export function ExperienceList() {
  const experience = useResumeStore((s) => s.resume.experience)
  const addExperience = useResumeStore((s) => s.addExperience)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="qu-headline text-2xl uppercase tracking-wide">
          Work Experience
        </h2>
        <p className="mt-1 text-sm">
          Add your work history, starting with the most recent position.
        </p>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <ExperienceItemForm key={exp.id} id={exp.id} index={index} />
        ))}
      </div>

      <Button onClick={addExperience} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}
