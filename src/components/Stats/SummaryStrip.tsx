import { winrateTier, type Summary } from "../../lib/stats/aggregate"
import { tierClasses } from "../../lib/stats/tiers"
import { cn } from "../../lib/utils"

type SummaryStripProps = {
  summary: Summary
  /** Shown under the cells, for the 1,500-match cap. */
  note?: string
}

export default function SummaryStrip({ summary, note }: SummaryStripProps) {
  const shown = Math.round(summary.winrate)
  const tier = tierClasses(winrateTier(shown))
  const cells: { label: string; value: string; className?: string }[] = [
    { label: "Games", value: summary.games.toLocaleString() },
    { label: "Wins", value: summary.wins.toLocaleString(), className: "text-radiant" },
    { label: "Losses", value: summary.losses.toLocaleString(), className: "text-dire" },
    {
      label: "Win %",
      value: summary.games === 0 ? "—" : `${shown}%`,
      className: summary.games === 0 ? "text-muted-foreground" : tier.text,
    },
    { label: "Avg KDA", value: summary.games === 0 ? "—" : summary.avgKDA.toFixed(2), className: "text-mana" },
  ]

  return (
    <div className="panel brackets relative p-5 md:p-6">
      {/* Own clipping layer, so the glow stays inside the panel without cutting the corner brackets. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
      </div>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {cells.map((cell) => (
          <div key={cell.label} className="flex flex-col items-center gap-1 text-center">
            <dt className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{cell.label}</dt>
            <dd className={cn("font-mono text-2xl md:text-3xl", cell.className ?? "gold-text")}>{cell.value}</dd>
          </div>
        ))}
      </dl>
      {note && (
        <p className="mt-4 text-center font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{note}</p>
      )}
    </div>
  )
}
