import type { Resume } from '@/types/resume'
import { formatDateRange, formatMonthYear } from '@/lib/date'

/**
 * Renderer-agnostic description of the resume layout (Architecture §7).
 * Both ResumePreview (HTML) and ResumePdfDocument (@react-pdf) map THIS model,
 * so section order, headings, and empty-section omission are decided once and
 * can never drift between screen and PDF.
 */

export interface HeaderModel {
  fullName: string
  jobTitle: string
  /** Inline contact pieces (email · phone · city), already filtered. */
  contacts: string[]
  /** Hyperlinks (LinkedIn, portfolio) with display label + url. */
  links: Array<{ label: string; url: string }>
}

export interface ExperienceItemModel {
  position: string
  company: string
  location: string
  dateRange: string
  bullets: string[]
}

export interface EducationItemModel {
  degree: string
  fieldOfStudy: string
  institution: string
  location: string
  dateRange: string
  notes: string[]
}

export interface CertificationItemModel {
  name: string
  meta: string // "Issuer · Jan 2023"
  credentialUrl: string
}

export type ResumeSection =
  | { key: 'summary'; title: string; visible: boolean; paragraph: string }
  | { key: 'experience'; title: string; visible: boolean; items: ExperienceItemModel[] }
  | { key: 'education'; title: string; visible: boolean; items: EducationItemModel[] }
  | { key: 'skills'; title: string; visible: boolean; skills: string[] }
  | { key: 'certifications'; title: string; visible: boolean; items: CertificationItemModel[] }

export interface ResumeTemplateModel {
  header: HeaderModel
  sections: ResumeSection[]
  /** True when the resume has literally nothing to show (empty-state). */
  isEmpty: boolean
}

/** Split a multi-line description into bullet lines (FR: rendered as bullets). */
function toBullets(description: string): string[] {
  return description
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean)
}

function domainFromUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '') + (u.pathname !== '/' ? u.pathname : '')
  } catch {
    return url
  }
}

/**
 * Build the single source-of-truth layout model. Empty sections are marked
 * `visible: false` so neither renderer emits an orphan heading (FR-3.3).
 */
export function buildResumeSections(resume: Resume): ResumeTemplateModel {
  const p = resume.personalInfo

  const contacts = [p.email.trim(), p.phone.trim(), p.city.trim()].filter(Boolean)
  const links: HeaderModel['links'] = []
  if (p.linkedin.trim()) links.push({ label: domainFromUrl(p.linkedin.trim()), url: p.linkedin.trim() })
  if (p.portfolio.trim()) links.push({ label: domainFromUrl(p.portfolio.trim()), url: p.portfolio.trim() })

  const header: HeaderModel = {
    fullName: p.fullName.trim(),
    jobTitle: p.jobTitle.trim(),
    contacts,
    links,
  }

  const summary = resume.summary.trim()

  const experienceItems: ExperienceItemModel[] = resume.experience
    .filter((e) => e.company.trim() || e.position.trim() || e.description.trim())
    .map((e) => ({
      position: e.position.trim(),
      company: e.company.trim(),
      location: e.location.trim(),
      dateRange: formatDateRange(e.startDate, e.endDate, e.isCurrent),
      bullets: toBullets(e.description),
    }))

  const educationItems: EducationItemModel[] = resume.education
    .filter((e) => e.institution.trim() || e.degree.trim())
    .map((e) => ({
      degree: e.degree.trim(),
      fieldOfStudy: e.fieldOfStudy.trim(),
      institution: e.institution.trim(),
      location: e.location.trim(),
      dateRange: formatDateRange(e.startDate, e.endDate, e.isCurrent),
      notes: toBullets(e.description),
    }))

  const skills = resume.skills.map((s) => s.trim()).filter(Boolean)

  const certificationItems: CertificationItemModel[] = resume.certifications
    .filter((c) => c.name.trim())
    .map((c) => {
      const metaParts = [c.issuer.trim(), formatMonthYear(c.date)].filter(Boolean)
      return {
        name: c.name.trim(),
        meta: metaParts.join(' · '),
        credentialUrl: c.credentialUrl.trim(),
      }
    })

  const sections: ResumeSection[] = [
    { key: 'summary', title: 'Professional Summary', visible: !!summary, paragraph: summary },
    { key: 'experience', title: 'Work Experience', visible: experienceItems.length > 0, items: experienceItems },
    { key: 'education', title: 'Education', visible: educationItems.length > 0, items: educationItems },
    { key: 'skills', title: 'Skills', visible: skills.length > 0, skills },
    { key: 'certifications', title: 'Certifications', visible: certificationItems.length > 0, items: certificationItems },
  ]

  const isEmpty =
    !header.fullName &&
    !header.jobTitle &&
    contacts.length === 0 &&
    links.length === 0 &&
    !sections.some((s) => s.visible)

  return { header, sections, isEmpty }
}
