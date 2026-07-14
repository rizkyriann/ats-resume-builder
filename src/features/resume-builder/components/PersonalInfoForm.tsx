import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PersonalInfoSchema, type PersonalInfo } from '@/types/resume'
import { useResumeStore } from '@/store/resumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.resume.personalInfo)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)

  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: personalInfo,
    mode: 'onBlur',
  })

  const handleChange = (field: keyof PersonalInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updatePersonalInfo({ [field]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="qu-headline text-2xl uppercase tracking-wide">Personal Information</h2>
        <p className="mt-1 text-sm">
          Enter your contact details and professional identity.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            onChange={handleChange('fullName')}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            onChange={handleChange('jobTitle')}
            placeholder="Senior Software Engineer"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-destructive">{errors.jobTitle.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              onChange={handleChange('email')}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              onChange={handleChange('phone')}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register('city')}
            onChange={handleChange('city')}
            placeholder="San Francisco, CA"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              {...register('linkedin')}
              onChange={handleChange('linkedin')}
              placeholder="https://linkedin.com/in/johndoe"
            />
            {errors.linkedin && (
              <p className="mt-1 text-sm text-destructive">{errors.linkedin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              {...register('portfolio')}
              onChange={handleChange('portfolio')}
              placeholder="https://johndoe.com"
            />
            {errors.portfolio && (
              <p className="mt-1 text-sm text-destructive">{errors.portfolio.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
