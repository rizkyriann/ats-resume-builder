import type { CategoryScore } from '@/types/ats'

interface ScoreCategoryBreakdownProps {
  categories: CategoryScore[]
}

export function ScoreCategoryBreakdown({ categories }: ScoreCategoryBreakdownProps) {
  const getProgressColor = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100
    if (percent >= 80) return 'bg-[#008000]'
    if (percent >= 60) return 'bg-[#ffa500]'
    return 'bg-[#ff0000]'
  }

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const percent = (cat.score / cat.maxScore) * 100

        return (
          <div key={cat.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{cat.label}</span>
              <span className="text-gray-600">
                {Math.round(cat.score)} / {cat.maxScore}
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden border-[2px] border-black bg-[#f0f0f0]">
              <div
                className={`h-full transition-all ${getProgressColor(cat.score, cat.maxScore)}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            {cat.suggestions.length > 0 && (
              <ul className="mt-1 space-y-1 text-xs">
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
