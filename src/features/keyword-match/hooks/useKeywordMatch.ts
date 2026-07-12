import { useMemo } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { matchKeywords } from '@/engines/keyword-engine'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function useKeywordMatch(jobDescription: string) {
  const resume = useResumeStore((s) => s.resume)
  const debouncedResume = useDebouncedValue(resume, 300)
  const debouncedJd = useDebouncedValue(jobDescription, 300)

  const result = useMemo(() => {
    if (!debouncedJd.trim()) return null
    return matchKeywords(debouncedResume, debouncedJd)
  }, [debouncedResume, debouncedJd])

  return result
}
