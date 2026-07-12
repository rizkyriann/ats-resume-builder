import { useKeywordMatch } from '../hooks/useKeywordMatch'

interface KeywordMatchResultsProps {
  jobDescription: string
}

export function KeywordMatchResults({ jobDescription }: KeywordMatchResultsProps) {
  const result = useKeywordMatch(jobDescription)

  if (!jobDescription.trim()) {
    return (
      <p className="text-sm">
        Paste a job description above to analyze keyword matches.
      </p>
    )
  }

  if (!result) {
    return <p className="font-mono text-sm uppercase tracking-wider">Analyzing...</p>
  }

  if (result.matched.length === 0 && result.missing.length === 0) {
    return (
      <p className="text-sm">
        No keywords could be extracted from this job description.
      </p>
    )
  }

  const getCoverageColor = (percent: number) => {
    if (percent >= 80) return 'text-[#008000]'
    if (percent >= 60) return 'text-[#ffa500]'
    return 'text-[#ff0000]'
  }

  return (
    <div className="space-y-6">
      <div className="border-[3px] border-black p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Coverage</span>
          <span className={`rb-headline text-2xl ${getCoverageColor(result.coveragePercent)}`}>
            {Math.round(result.coveragePercent)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden border-[2px] border-black bg-[#f0f0f0]">
          <div
            className={`h-full transition-all ${
              result.coveragePercent >= 80
                ? 'bg-[#008000]'
                : result.coveragePercent >= 60
                  ? 'bg-[#ffa500]'
                  : 'bg-[#ff0000]'
            }`}
            style={{ width: `${Math.min(result.coveragePercent, 100)}%` }}
          />
        </div>
      </div>

      {result.matched.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold uppercase tracking-wide text-[#008000]">
            Matched Keywords ({result.matched.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matched.map((kw) => (
              <span
                key={kw.term}
                className="border-[2px] border-[#008000] bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
              >
                {kw.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.missing.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold uppercase tracking-wide text-[#ff0000]">
            Missing Keywords ({result.missing.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing.map((kw) => (
              <span
                key={kw.term}
                className="border-[2px] border-[#ff0000] bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
              >
                {kw.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold uppercase tracking-wide">Suggestions</h3>
          <ul className="space-y-1 text-sm">
            {result.suggestions.map((suggestion, i) => (
              <li key={i}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
