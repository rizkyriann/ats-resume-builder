import { useAtsScore } from '../hooks/useAtsScore'
import { ScoreCategoryBreakdown } from './ScoreCategoryBreakdown'

export function AtsScorePanel() {
  const score = useAtsScore()

  const getScoreColor = (overall: number) => {
    if (overall >= 80) return 'text-[#008000]'
    if (overall >= 60) return 'text-[#ffa500]'
    return 'text-[#ff0000]'
  }

  return (
    <div className="border-[3px] border-black bg-white p-6">
      <div className="mb-4">
        <h2 className="rb-headline text-lg uppercase tracking-wide">ATS Score</h2>
        <p className="mt-1 text-sm">
          How well your resume performs with Applicant Tracking Systems
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className={`rb-headline text-5xl ${getScoreColor(score.overall)}`}>
            {Math.round(score.overall)}
          </span>
          <span className="text-2xl text-gray-600">/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        <ScoreCategoryBreakdown categories={score.categories} />
      </div>

      <div className="mt-4 border-[2px] border-black bg-[#f0f0f0] p-3 text-xs">
        <p>
          ⚠️ This score is a best-effort heuristic based on common ATS behaviors. Real ATS
          software varies widely. Use this as guidance, not a guarantee.
        </p>
      </div>
    </div>
  )
}
