export interface KeywordHit {
  /** The keyword or phrase as extracted from the job description. */
  term: string
  /** Relative importance weight (frequency + requirements-section boost). */
  weight: number
}

export interface KeywordMatchResult {
  matched: KeywordHit[]
  missing: KeywordHit[]
  /** Weighted matched ÷ total, as a 0–100 percentage. */
  coveragePercent: number
  suggestions: string[]
  /** True when the JD produced no usable keywords (empty/gibberish input). */
  empty: boolean
}
