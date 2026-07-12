import type { AtsCategoryKey } from '@/types/ats'

/**
 * Default category weights out of 100 (Architecture §13.2).
 * Single source of truth — tune here without touching rule logic.
 */
export const ATS_WEIGHTS: Record<AtsCategoryKey, number> = {
  contactInfo: 15,
  summary: 10,
  experience: 20,
  education: 10,
  skills: 10,
  certifications: 5,
  keywordMatch: 15,
  completeness: 10,
  formatting: 5,
}

export const ATS_LABELS: Record<AtsCategoryKey, string> = {
  contactInfo: 'Contact Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  keywordMatch: 'Keyword Match',
  completeness: 'Resume Completeness',
  formatting: 'Formatting',
}
