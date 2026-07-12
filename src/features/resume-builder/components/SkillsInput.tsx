import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

export function SkillsInput() {
  const skills = useResumeStore((s) => s.resume.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)

  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = input.trim()
      if (trimmed) {
        addSkill(trimmed)
        setInput('')
      }
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1]!)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="rb-headline text-2xl uppercase tracking-wide">Skills</h2>
        <p className="mt-1 text-sm">
          Add your technical and professional skills.
        </p>
      </div>

      <div>
        <Label htmlFor="skills-input">Skills</Label>
        <Input
          id="skills-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter or comma"
          className="mb-3"
        />
        <p className="text-xs text-muted-foreground">
          Press Enter or comma to add. Press Backspace on empty input to remove last skill.
        </p>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-1 border-[2px] border-black bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
            >
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-black hover:text-white"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills added yet. Start typing to add skills.</p>
      )}
    </div>
  )
}
