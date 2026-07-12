import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a stable debounced version of `fn`. Rapid calls collapse into a
 * single invocation after `delayMs` of quiet. Used by the autosave subscriber.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  const fnRef = useRef(fn)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return useCallback(
    (...args: Args) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        fnRef.current(...args)
      }, delayMs)
    },
    [delayMs],
  )
}
