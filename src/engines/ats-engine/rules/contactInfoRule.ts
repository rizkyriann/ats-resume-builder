import { z } from 'zod'
import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

/**
 * Contact Information (weight 15).
 * Full name is required (large penalty if missing); email (valid), phone, and
 * city each contribute. Sub-weights sum to 1.0.
 */
export const contactInfoRule: Rule = (resume) => {
  const { fullName, email, phone, city } = resume.personalInfo
  const suggestions: string[] = []
  let ratio = 0

  // Full name — 0.4
  if (fullName.trim()) {
    ratio += 0.4
  } else {
    suggestions.push('Add your full name — it anchors your entire resume for ATS parsers.')
  }

  // Email — 0.25 (must be valid)
  if (email.trim()) {
    if (z.email().safeParse(email.trim()).success) {
      ratio += 0.25
    } else {
      suggestions.push('Your email address looks invalid — fix it so recruiters can reach you.')
    }
  } else {
    suggestions.push('Add an email address so recruiters and ATS parsers can find your contact info.')
  }

  // Phone — 0.2
  if (phone.trim()) {
    ratio += 0.2
  } else {
    suggestions.push('Add a phone number — many ATS parsers expect one in the contact block.')
  }

  // City — 0.15
  if (city.trim()) {
    ratio += 0.15
  } else {
    suggestions.push('Add your city/location; recruiters often filter candidates by location.')
  }

  return { ratio: clamp01(ratio), suggestions }
}
