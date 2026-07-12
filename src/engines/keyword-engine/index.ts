import type { Resume } from '@/types/resume'
import type { KeywordHit, KeywordMatchResult } from '@/types/keyword'
import { extractKeywords, keyOf } from './extractKeywords'
import { normalizeText, stem } from './normalize'

/**
 * Collect all searchable resume text (summary, experience, skills,
 * certifications, education) into one normalized+stemmed haystack string.
 */
export function buildResumeHaystack(resume: Resume): string {
  const parts: string[] = []
  parts.push(resume.summary)
  for (const exp of resume.experience) {
    parts.push(exp.company, exp.position, exp.location, exp.description)
  }
  for (const edu of resume.education) {
    parts.push(edu.institution, edu.degree, edu.fieldOfStudy, edu.description)
  }
  for (const cert of resume.certifications) {
    parts.push(cert.name, cert.issuer)
  }
  parts.push(...resume.skills)

  // Stem every token so "developing" in the resume matches "develop" from JD.
  const normalized = normalizeText(parts.join(' '))
  return normalized
    .split(' ')
    .filter(Boolean)
    .map(stem)
    .join(' ')
}

/** Does the stemmed haystack contain the keyword's stemmed key? */
function haystackContains(haystack: string, key: string): boolean {
  if (!key) return false
  // Word-boundary-ish match on the space-joined stem stream.
  const padded = ` ${haystack} `
  return padded.includes(` ${key} `) || haystack.includes(key)
}

/**
 * Compare a job description against a resume and report matched/missing
 * keywords, weighted coverage %, and suggestions (Architecture §14).
 * Deterministic and free of division-by-zero on empty input.
 */
export function matchKeywords(
  resume: Resume,
  jobDescription: string,
): KeywordMatchResult {
  const keywords = extractKeywords(jobDescription)

  if (keywords.length === 0) {
    return {
      matched: [],
      missing: [],
      coveragePercent: 0,
      suggestions: [],
      empty: true,
    }
  }

  const haystack = buildResumeHaystack(resume)
  const matched: KeywordHit[] = []
  const missing: KeywordHit[] = []

  let totalWeight = 0
  let matchedWeight = 0

  for (const kw of keywords) {
    totalWeight += kw.weight
    const key = keyOf(kw.term)
    if (haystackContains(haystack, key)) {
      matched.push(kw)
      matchedWeight += kw.weight
    } else {
      missing.push(kw)
    }
  }

  const coveragePercent =
    totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0

  // Suggest the highest-weight missing keywords first.
  const suggestions = missing
    .slice(0, 6)
    .map(
      (kw) =>
        `Consider adding "${kw.term}" to your Skills or Experience if it genuinely applies to you.`,
    )

  return {
    matched,
    missing,
    coveragePercent,
    suggestions,
    empty: false,
  }
}
