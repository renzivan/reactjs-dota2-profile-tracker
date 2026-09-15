import type { TimelineBucket } from "../../lib/stats/aggregate"
import { Tooltip } from "../ui/tooltip"

type WinrateTimelineProps = {
  buckets: TimelineBucket[]
  granularity: "day" | "week"
}

/**
 * One column per bucket. Height is games relative to the busiest bucket,
 * stacked wins over losses. Empty buckets keep their slot as a faint tick so
 * time is never compressed.
 */
export default function WinrateTimeline({ buckets, granularity }: WinrateTimelineProps) {
  const max = Math.max(1, ...buckets.map((b) => b.matches))
  const total = buckets.reduce((n, b) => n + b.matches, 0)
  const first = buckets[0]
  const last = buckets[buckets.length - 1]

  if (total === 0) {
    return (
      <p className="py-6 text-center font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
        No games
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-36 items-end gap-px sm:gap-0.5" role="img" aria-label={`Games per ${granularity} with wins and losses`}>
        {buckets.map((b) => {
          const losses = b.matches - b.wins
          const height = (b.matches / max) * 100
          const winShare = b.matches === 0 ? 0 : (b.wins / b.matches) * 100
          const column = (
            <div className="flex h-36 w-full flex-col justify-end">
              {b.matches === 0 ? (
                <div className="h-px w-full bg-gold/25" />
              ) : (
                <div className="flex w-full flex-col overflow-hidden rounded-t-sm" style={{ height: `${height}%` }}>
                  <div className="w-full bg-radiant/80" style={{ height: `${winShare}%` }} />
                  <div className="w-full flex-1 bg-dire/80" />
                </div>
              )}
            </div>
          )
          return (
            <Tooltip
              key={b.start.getTime()}
              className="font-mono text-xs"
              triggerClassName="flex h-36 flex-1"
              trigger={column}
              content={
                <p>
                  {b.label} · <span className="text-radiant">{b.wins}W</span> <span className="text-dire">{losses}L</span>
                </p>
              }
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{first?.label}</span>
        <span>
          {total} games · {buckets.length} {granularity === "day" ? "days" : "weeks"}
        </span>
        <span>{last?.label}</span>
      </div>
    </div>
  )
}
