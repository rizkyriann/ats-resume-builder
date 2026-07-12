export type AtsCategoryKey =
  | 'contactInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'keywordMatch'
  | 'completeness'
  | 'formatting'

export interface CategoryScore {
  key: AtsCategoryKey
  label: string
  /** Points earned in this category (already scaled to its weight). */
  score: number
  /** Maximum points this category contributes to the overall (its weight). */
  maxScore: number
  /** Specific, actionable suggestions for lost points (FR-7.3). */
  suggestions: string[]
}

export interface AtsScoreResult {
  /** Overall score 0–100 (rounded). */
  overall: number
  categories: CategoryScore[]
}
