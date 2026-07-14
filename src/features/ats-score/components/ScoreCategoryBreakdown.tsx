import type { CategoryScore } from '@/types/ats'

interface ScoreCategoryBreakdownProps {
  categories: CategoryScore[]
}

export function ScoreCategoryBreakdown({ categories }: ScoreCategoryBreakdownProps) {
  const getProgressColor = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100
    if (percent >= 80) return 'bg-qu-success'
    if (percent >= 60) return 'bg-qu-warning'
    return 'bg-qu-error'
  }

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const percent = (cat.score / cat.maxScore) * 100

        return (
          <div key={cat.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-qu-text">{cat.label}</span>
              <span className="text-qu-text-muted">
                {Math.round(cat.score)} / {cat.maxScore}
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-qu-sm border border-qu-border bg-qu-surface">
              <div
                className={`h-full transition-all ${getProgressColor(cat.score, cat.maxScore)}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            {cat.suggestions.length > 0 && (
              <ul className="mt-1 space-y-1 text-xs text-qu-text-muted">
                {cat.suggestions.map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
