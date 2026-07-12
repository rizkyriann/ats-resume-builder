import type { Resume } from '@/types/resume'
import type { AtsCategoryKey, AtsScoreResult, CategoryScore } from '@/types/ats'
import type { KeywordMatchResult } from '@/types/keyword'
import { ATS_LABELS, ATS_WEIGHTS } from './weights'
import type { RuleOutput } from './rules/ruleTypes'
import { contactInfoRule } from './rules/contactInfoRule'
import { summaryRule } from './rules/summaryRule'
import { experienceRule } from './rules/experienceRule'
import { educationRule } from './rules/educationRule'
import { skillsRule } from './rules/skillsRule'
import { certificationsRule } from './rules/certificationsRule'
import { completenessRule } from './rules/completenessRule'
import { formattingRule } from './rules/formattingRule'

/** Non-keyword rules keyed by category. */
const RULES: Partial<Record<AtsCategoryKey, (resume: Resume) => RuleOutput>> = {
  contactInfo: contactInfoRule,
  summary: summaryRule,
  experience: experienceRule,
  education: educationRule,
  skills: skillsRule,
  certifications: certificationsRule,
  completeness: completenessRule,
  formatting: formattingRule,
}

/** Fixed order the categories are presented in. */
const NON_KEYWORD_ORDER: AtsCategoryKey[] = [
  'contactInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'certifications',
  'completeness',
  'formatting',
]

/**
 * Compute a deterministic 0–100 ATS score with per-category breakdown
 * (Architecture §13). Pure: same input → same output, no I/O, no Date/random.
 *
 * When `keywordMatch` is provided, the Keyword Match category (weight 15) is
 * scored from its coverage. When absent, that weight is redistributed
 * proportionally across the other categories so max score is still 100.
 */
export function calculateAtsScore(
  resume: Resume,
  keywordMatch?: KeywordMatchResult,
): AtsScoreResult {
  const hasKeyword = !!keywordMatch && !keywordMatch.empty

  // Effective weights: redistribute the keyword weight when no JD is present.
  const effectiveWeights: Record<AtsCategoryKey, number> = { ...ATS_WEIGHTS }
  if (!hasKeyword) {
    const keywordWeight = ATS_WEIGHTS.keywordMatch
    effectiveWeights.keywordMatch = 0
    const baseSum = NON_KEYWORD_ORDER.reduce((acc, k) => acc + ATS_WEIGHTS[k], 0)
    for (const key of NON_KEYWORD_ORDER) {
      effectiveWeights[key] =
        ATS_WEIGHTS[key] + (ATS_WEIGHTS[key] / baseSum) * keywordWeight
    }
  }

  const categories: CategoryScore[] = []

  for (const key of NON_KEYWORD_ORDER) {
    const rule = RULES[key]
    if (!rule) continue
    const { ratio, suggestions } = rule(resume)
    const maxScore = effectiveWeights[key]
    categories.push({
      key,
      label: ATS_LABELS[key],
      score: round2(ratio * maxScore),
      maxScore: round2(maxScore),
      suggestions,
    })
  }

  if (hasKeyword && keywordMatch) {
    const ratio = keywordMatch.coveragePercent / 100
    const maxScore = effectiveWeights.keywordMatch
    const suggestions =
      keywordMatch.coveragePercent >= 80
        ? []
        : keywordMatch.suggestions.slice(0, 3).length > 0
          ? keywordMatch.suggestions.slice(0, 3)
          : ['Add more of the job description’s keywords that genuinely apply to you.']
    categories.push({
      key: 'keywordMatch',
      label: ATS_LABELS.keywordMatch,
      score: round2(ratio * maxScore),
      maxScore: round2(maxScore),
      suggestions,
    })
  }

  const overall = Math.round(
    categories.reduce((acc, c) => acc + c.score, 0),
  )

  return { overall: Math.max(0, Math.min(100, overall)), categories }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
