import { MIN_SAMPLE, winrate, winrateTier, type BarRow } from "../../lib/stats/aggregate"
import { tierClasses } from "../../lib/stats/tiers"
import { cn } from "../../lib/utils"
import { Tooltip } from "../ui/tooltip"

type WinrateBarsProps = {
  rows: BarRow[]
  emptyLabel?: string
}

export default function WinrateBars({ rows, emptyLabel = "No games" }: WinrateBarsProps) {
  if (rows.every((r) => r.matches === 0)) {
    return (
      <p className="py-6 text-center font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {emptyLabel}
      </p>
    )
  }

  return (
    <div role="list" className="flex flex-col gap-3">
      {rows.map((row) => {
        const pct = winrate({ matchCount: row.matches, winCount: row.wins })
        const shown = Math.round(pct)
        const tier = tierClasses(winrateTier(shown))
        const lowSample = row.matches < MIN_SAMPLE
        const line = (
          <div
            className={cn(
              "grid grid-cols-[minmax(0,9rem)_minmax(3rem,1fr)_3rem_3.5rem] items-center gap-3",
              lowSample && "opacity-50",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              {row.icon && <img src={row.icon} alt="" className="h-6 w-6 shrink-0 rounded-sm object-contain" />}
              <span className="truncate font-display text-[11px] uppercase tracking-[0.15em]">{row.label}</span>
            </div>
            <div
              role="meter"
              aria-label={`${row.label} winrate`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={shown}
              className="h-2 overflow-hidden rounded-sm bg-secondary ring-1 ring-inset ring-gold/15"
            >
              <div className={cn("h-full rounded-sm transition-[width] duration-500", tier.fill)} style={{ width: `${pct}%` }} />
            </div>
            <span className={cn("text-right font-mono text-sm", row.matches === 0 ? "text-muted-foreground" : tier.text)}>
              {row.matches === 0 ? "—" : `${shown}%`}
            </span>
            <span className="text-right font-mono text-xs text-muted-foreground">n {row.matches}</span>
            {lowSample && <span className="sr-only">Fewer than {MIN_SAMPLE} games</span>}
          </div>
        )
        return (
          <div key={row.key} role="listitem">
            {lowSample ? <Tooltip trigger={line} content={<p>Fewer than {MIN_SAMPLE} games</p>} /> : line}
          </div>
        )
      })}
    </div>
  )
}
