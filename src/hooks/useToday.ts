import { useEffect, useState } from 'react'

const msUntilNextLocalMidnight = (from: Date) => {
  const next = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
  return next.getTime() - from.getTime()
}

/**
 * A Date that is stable within a local calendar day and rolls over at local
 * midnight without any user action. Windows snap to day boundaries, so this
 * is the only granularity at which "now" needs to change.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(new Date()), msUntilNextLocalMidnight(today) + 1000)
    return () => window.clearTimeout(timer)
  }, [today])

  return today
}
