import { useMemo } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { calculateAtsScore } from '@/engines/ats-engine'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function useAtsScore() {
  const resume = useResumeStore((s) => s.resume)
  const debouncedResume = useDebouncedValue(resume, 300)

  const score = useMemo(
    () => calculateAtsScore(debouncedResume),
    [debouncedResume]
  )

  return score
}
