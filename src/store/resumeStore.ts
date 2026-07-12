import { create } from 'zustand'
import {
  type Resume,
  type PersonalInfo,
  type Experience,
  type Education,
  type Certification,
  createEmptyResume,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyCertification,
} from '@/types/resume'
import { resumeRepository } from '@/services/storage/resumeRepository'
import { generateId } from '@/lib/id'

/** Move an item within an array immutably; out-of-range is a no-op. */
function move<T>(arr: T[], from: number, to: number): T[] {
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return arr
  const next = arr.slice()
  const [item] = next.splice(from, 1)
  if (item === undefined) return arr
  next.splice(to, 0, item)
  return next
}

export interface ResumeStore {
  resume: Resume

  // Whole-resume replacement (import, clear).
  setResume: (resume: Resume) => void
  resetResume: () => void

  // Personal info & summary
  updatePersonalInfo: (patch: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void

  // Experience
  addExperience: () => string
  updateExperience: (id: string, patch: Partial<Omit<Experience, 'id'>>) => void
  removeExperience: (id: string) => void
  reorderExperience: (from: number, to: number) => void

  // Education
  addEducation: () => string
  updateEducation: (id: string, patch: Partial<Omit<Education, 'id'>>) => void
  removeEducation: (id: string) => void
  reorderEducation: (from: number, to: number) => void

  // Skills (case-insensitive de-dup)
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  reorderSkills: (from: number, to: number) => void

  // Certifications
  addCertification: () => string
  updateCertification: (id: string, patch: Partial<Omit<Certification, 'id'>>) => void
  removeCertification: (id: string) => void
  reorderCertifications: (from: number, to: number) => void
}

/** Initial state: hydrate from storage, else an empty resume. */
function loadInitialResume(): Resume {
  try {
    return resumeRepository.load() ?? createEmptyResume()
  } catch {
    // e.g. UnsupportedSchemaVersionError — start fresh; app-level code can warn.
    return createEmptyResume()
  }
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: loadInitialResume(),

  setResume: (resume) => set({ resume }),
  resetResume: () => set({ resume: createEmptyResume() }),

  updatePersonalInfo: (patch) =>
    set((s) => ({
      resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...patch } },
    })),

  updateSummary: (summary) => set((s) => ({ resume: { ...s.resume, summary } })),

  addExperience: () => {
    const id = generateId()
    set((s) => ({
      resume: { ...s.resume, experience: [...s.resume.experience, createEmptyExperience(id)] },
    }))
    return id
  },
  updateExperience: (id, patch) =>
    set((s) => ({
      resume: {
        ...s.resume,
        experience: s.resume.experience.map((e) => {
          if (e.id !== id) return e
          const next = { ...e, ...patch }
          // Current job → end date is cleared/ignored (FR-1.4).
          if (next.isCurrent) next.endDate = ''
          return next
        }),
      },
    })),
  removeExperience: (id) =>
    set((s) => ({
      resume: { ...s.resume, experience: s.resume.experience.filter((e) => e.id !== id) },
    })),
  reorderExperience: (from, to) =>
    set((s) => ({ resume: { ...s.resume, experience: move(s.resume.experience, from, to) } })),

  addEducation: () => {
    const id = generateId()
    set((s) => ({
      resume: { ...s.resume, education: [...s.resume.education, createEmptyEducation(id)] },
    }))
    return id
  },
  updateEducation: (id, patch) =>
    set((s) => ({
      resume: {
        ...s.resume,
        education: s.resume.education.map((e) => {
          if (e.id !== id) return e
          const next = { ...e, ...patch }
          if (next.isCurrent) next.endDate = ''
          return next
        }),
      },
    })),
  removeEducation: (id) =>
    set((s) => ({
      resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) },
    })),
  reorderEducation: (from, to) =>
    set((s) => ({ resume: { ...s.resume, education: move(s.resume.education, from, to) } })),

  addSkill: (skill) =>
    set((s) => {
      const trimmed = skill.trim()
      if (!trimmed) return s
      const exists = s.resume.skills.some((k) => k.toLowerCase() === trimmed.toLowerCase())
      if (exists) return s
      return { resume: { ...s.resume, skills: [...s.resume.skills, trimmed] } }
    }),
  removeSkill: (skill) =>
    set((s) => ({
      resume: {
        ...s.resume,
        skills: s.resume.skills.filter((k) => k.toLowerCase() !== skill.toLowerCase()),
      },
    })),
  reorderSkills: (from, to) =>
    set((s) => ({ resume: { ...s.resume, skills: move(s.resume.skills, from, to) } })),

  addCertification: () => {
    const id = generateId()
    set((s) => ({
      resume: {
        ...s.resume,
        certifications: [...s.resume.certifications, createEmptyCertification(id)],
      },
    }))
    return id
  },
  updateCertification: (id, patch) =>
    set((s) => ({
      resume: {
        ...s.resume,
        certifications: s.resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    })),
  removeCertification: (id) =>
    set((s) => ({
      resume: { ...s.resume, certifications: s.resume.certifications.filter((c) => c.id !== id) },
    })),
  reorderCertifications: (from, to) =>
    set((s) => ({
      resume: { ...s.resume, certifications: move(s.resume.certifications, from, to) },
    })),
}))
