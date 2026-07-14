import { useKeywordMatch } from '../hooks/useKeywordMatch'

interface KeywordMatchResultsProps {
  jobDescription: string
}

export function KeywordMatchResults({ jobDescription }: KeywordMatchResultsProps) {
  const result = useKeywordMatch(jobDescription)

  if (!jobDescription.trim()) {
    return (
      <p className="text-sm text-qu-text-muted">
        Paste a job description above to analyze keyword matches.
      </p>
    )
  }

  if (!result) {
    return <p className="qu-mono text-sm uppercase tracking-wider text-qu-text-muted">Analyzing...</p>
  }

  if (result.matched.length === 0 && result.missing.length === 0) {
    return (
      <p className="text-sm text-qu-text-muted">
        No keywords could be extracted from this job description.
      </p>
    )
  }

  const getCoverageColor = (percent: number) => {
    if (percent >= 80) return 'text-qu-success'
    if (percent >= 60) return 'text-qu-warning'
    return 'text-qu-red-text'
  }

  return (
    <div className="space-y-6">
      <div className="qu-card rounded-qu p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="qu-headline text-sm uppercase tracking-wide text-qu-text">Coverage</span>
          <span className={`qu-headline text-2xl ${getCoverageColor(result.coveragePercent)}`}>
            {Math.round(result.coveragePercent)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-qu-sm border border-qu-border bg-qu-surface">
          <div
            className={`h-full transition-all ${
              result.coveragePercent >= 80
                ? 'bg-qu-success'
                : result.coveragePercent >= 60
                  ? 'bg-qu-warning'
                  : 'bg-qu-error'
            }`}
            style={{ width: `${Math.min(result.coveragePercent, 100)}%` }}
          />
        </div>
      </div>

      {result.matched.length > 0 && (
        <div>
          <h3 className="qu-headline mb-2 text-sm uppercase tracking-wide text-qu-success">
            Matched Keywords ({result.matched.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matched.map((kw) => (
              <span
                key={kw.term}
                className="qu-headline rounded-qu-sm border border-qu-success/50 bg-qu-success/15 px-3 py-1 text-[11px] uppercase tracking-[1px] text-qu-success"
              >
                {kw.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.missing.length > 0 && (
        <div>
          <h3 className="qu-headline mb-2 text-sm uppercase tracking-wide text-qu-red-text">
            Missing Keywords ({result.missing.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing.map((kw) => (
              <span
                key={kw.term}
                className="qu-headline rounded-qu-sm border border-qu-red/60 bg-qu-red/15 px-3 py-1 text-[11px] uppercase tracking-[1px] text-qu-red-text"
              >
                {kw.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div>
          <h3 className="qu-headline mb-2 text-sm uppercase tracking-wide text-qu-gold">Suggestions</h3>
          <ul className="space-y-1 text-sm text-qu-text-muted">
            {result.suggestions.map((suggestion, i) => (
              <li key={i}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
