import { useAtsScore } from '../hooks/useAtsScore'
import { ScoreCategoryBreakdown } from './ScoreCategoryBreakdown'

export function AtsScorePanel() {
  const score = useAtsScore()

  const getScoreColor = (overall: number) => {
    if (overall >= 80) return 'text-qu-success'
    if (overall >= 60) return 'text-qu-warning'
    return 'text-qu-red-text'
  }

  return (
    <div className="qu-card-elevated p-6">
      <div className="mb-4">
        <h2 className="qu-headline text-lg uppercase tracking-wide text-qu-gold">ATS Score</h2>
        <p className="mt-1 text-sm text-qu-text-muted">
          How well your resume performs with Applicant Tracking Systems
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className={`qu-headline text-5xl ${getScoreColor(score.overall)}`}>
            {Math.round(score.overall)}
          </span>
          <span className="text-2xl text-qu-text-muted">/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        <ScoreCategoryBreakdown categories={score.categories} />
      </div>

      <div className="mt-4 rounded-qu border border-qu-border bg-qu-surface p-3 text-xs text-qu-text-muted">
        <p>
          ⚠️ This score is a best-effort heuristic based on common ATS behaviors. Real ATS
          software varies widely. Use this as guidance, not a guarantee.
        </p>
      </div>
    </div>
  )
}
