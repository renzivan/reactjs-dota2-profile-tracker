import { useState } from "react"
import type { TimelineBucket } from "../../lib/stats/aggregate"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type WinrateTimelineProps = {
  buckets: TimelineBucket[]
  granularity: "day" | "week"
}

/** Colour swatch + label, used in the legend and in each column's detail panel. */
const Swatch = ({ tone, children }: { tone: "radiant" | "dire" | "empty"; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5">
    <span
      aria-hidden
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-sm",
        tone === "radiant" && "bg-radiant/80",
        tone === "dire" && "bg-dire/80",
        tone === "empty" && "h-px w-2.5 bg-gold/40",
      )}
    />
    {children}
  </span>
)

/**
 * One column per bucket. Height is games relative to the busiest bucket,
 * stacked wins over losses. Empty buckets keep their slot as a faint tick so
 * time is never compressed. Hovering a column opens its detail; clicking pins
 * it open so it also works on touch and keyboard.
 */
export default function WinrateTimeline({ buckets, granularity }: WinrateTimelineProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)

  const max = Math.max(1, ...buckets.map((b) => b.matches))
  const total = buckets.reduce((n, b) => n + b.matches, 0)
  const wins = buckets.reduce((n, b) => n + b.wins, 0)
  const first = buckets[0]
  const last = buckets[buckets.length - 1]
  const unit = granularity === "day" ? "days" : "weeks"

  if (total === 0) {
    return (
      <p className="py-6 text-center font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
        No games
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex h-36 items-end gap-px sm:gap-0.5"
        role="img"
        aria-label={`${buckets.length} ${unit}, ${total} games, ${wins} wins, ${total - wins} losses`}
      >
        {buckets.map((b, i) => {
          const losses = b.matches - b.wins
          const height = (b.matches / max) * 100
          const winShare = b.matches === 0 ? 0 : (b.wins / b.matches) * 100
          const winrate = b.matches === 0 ? 0 : Math.round((b.wins / b.matches) * 100)
          const open = pinned === i || (pinned === null && hovered === i)
          return (
            <Popover
              key={b.start.getTime()}
              open={open}
              onOpenChange={(next) => {
                if (!next) {
                  setPinned(null)
                  setHovered(null)
                }
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`${b.label}: ${b.wins} wins, ${losses} losses`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setPinned((p) => (p === i ? null : i))}
                  className={cn(
                    "flex h-36 flex-1 flex-col justify-end rounded-t-sm transition-colors hover:bg-gold/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    pinned === i && "bg-gold/10",
                  )}
                >
                  {b.matches === 0 ? (
                    <span className="block h-px w-full bg-gold/25" />
                  ) : (
                    <span className="flex w-full flex-col overflow-hidden rounded-t-sm" style={{ height: `${height}%` }}>
                      <span className="block w-full bg-radiant/80" style={{ height: `${winShare}%` }} />
                      <span className="block w-full flex-1 bg-dire/80" />
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                className="w-auto p-3 font-mono text-xs"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <p className="mb-2 font-display text-[10px] uppercase tracking-[0.25em] text-gold">{b.label}</p>
                {b.matches === 0 ? (
                  <p className="text-muted-foreground">No ranked games</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Swatch tone="radiant">
                      <span className="text-radiant">{b.wins}</span>&nbsp;{b.wins === 1 ? "win" : "wins"}
                    </Swatch>
                    <Swatch tone="dire">
                      <span className="text-dire">{losses}</span>&nbsp;{losses === 1 ? "loss" : "losses"}
                    </Swatch>
                    <p className="mt-1 text-muted-foreground">
                      {b.matches} {b.matches === 1 ? "game" : "games"} · {winrate}% winrate
                    </p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )
        })}
      </div>
      <table className="sr-only">
        <caption>Games per {granularity}</caption>
        <thead>
          <tr><th scope="col">{granularity === "day" ? "Day" : "Week"}</th><th scope="col">Wins</th><th scope="col">Losses</th></tr>
        </thead>
        <tbody>
          {buckets.filter((b) => b.matches > 0).map((b) => (
            <tr key={b.start.getTime()}><th scope="row">{b.label}</th><td>{b.wins}</td><td>{b.matches - b.wins}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{first?.label}</span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Swatch tone="radiant">Wins</Swatch>
          <Swatch tone="dire">Losses</Swatch>
          <Swatch tone="empty">No games</Swatch>
          <span>
            {total} games · {buckets.length} {unit}
          </span>
        </span>
        <span>{last?.label}</span>
      </div>
    </div>
  )
}
