import { z } from 'zod'

/**
 * Current resume schema version. Bump this and add a migration (see
 * services/storage/migrations) whenever the shape changes.
 */
export const SCHEMA_VERSION = 1

/** Optional string that, when present & non-empty, must be a valid email. */
const optionalEmail = z
  .string()
  .trim()
  .default('')
  .refine((v) => v === '' || z.email().safeParse(v).success, {
    message: 'Enter a valid email address.',
  })

/** Optional string that, when present & non-empty, must be a valid URL. */
const optionalUrl = z
  .string()
  .trim()
  .default('')
  .refine((v) => v === '' || z.url().safeParse(v).success, {
    message: 'Enter a valid URL (including https://).',
  })

/** ISO "YYYY-MM" month string, or empty. */
const monthString = z
  .string()
  .trim()
  .default('')
  .refine((v) => v === '' || /^\d{4}-\d{2}$/.test(v), {
    message: 'Use a valid month.',
  })

export const PersonalInfoSchema = z.object({
  fullName: z.string().trim().default(''),
  jobTitle: z.string().trim().default(''),
  email: optionalEmail,
  phone: z.string().trim().default(''),
  city: z.string().trim().default(''),
  linkedin: optionalUrl,
  portfolio: optionalUrl,
})

/** Start date must not be after end date when both present (FR-2.4). */
function startNotAfterEnd(entry: {
  startDate: string
  endDate: string | null
  isCurrent: boolean
}): boolean {
  if (entry.isCurrent) return true
  if (!entry.startDate || !entry.endDate) return true
  return entry.startDate <= entry.endDate
}

export const ExperienceSchema = z
  .object({
    id: z.string().min(1),
    company: z.string().trim().default(''),
    position: z.string().trim().default(''),
    location: z.string().trim().default(''),
    startDate: monthString,
    endDate: monthString.nullable().default(''),
    isCurrent: z.boolean().default(false),
    description: z.string().default(''),
  })
  .refine(startNotAfterEnd, {
    message: 'Start date must not be after end date.',
    path: ['endDate'],
  })

export const EducationSchema = z
  .object({
    id: z.string().min(1),
    institution: z.string().trim().default(''),
    degree: z.string().trim().default(''),
    fieldOfStudy: z.string().trim().default(''),
    location: z.string().trim().default(''),
    startDate: monthString,
    endDate: monthString.nullable().default(''),
    isCurrent: z.boolean().default(false),
    description: z.string().default(''),
  })
  .refine(startNotAfterEnd, {
    message: 'Start date must not be after end date.',
    path: ['endDate'],
  })

export const CertificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().default(''),
  issuer: z.string().trim().default(''),
  date: monthString,
  credentialUrl: optionalUrl,
})

export const ResumeMetaSchema = z.object({
  updatedAt: z.string().default(''),
})

export const ResumeSchema = z.object({
  schemaVersion: z.number().int().positive(),
  personalInfo: PersonalInfoSchema,
  summary: z.string().default(''),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(CertificationSchema).default([]),
  meta: ResumeMetaSchema,
})

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Education = z.infer<typeof EducationSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Resume = z.infer<typeof ResumeSchema>

/** A brand-new, empty but valid resume. */
export function createEmptyResume(): Resume {
  return {
    schemaVersion: SCHEMA_VERSION,
    personalInfo: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      city: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    meta: { updatedAt: '' },
  }
}

/** Factory helpers for new list items with client-generated ids. */
export function createEmptyExperience(id: string): Experience {
  return {
    id,
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  }
}

export function createEmptyEducation(id: string): Education {
  return {
    id,
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  }
}

export function createEmptyCertification(id: string): Certification {
  return {
    id,
    name: '',
    issuer: '',
    date: '',
    credentialUrl: '',
  }
}
