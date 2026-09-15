import { winrateTier, type Summary } from "../../lib/stats/aggregate"
import { tierClasses } from "../../lib/stats/tiers"
import { cn } from "../../lib/utils"

type SummaryStripProps = {
  summary: Summary
  /** Shown under the cells, for the 1,500-match cap. */
  note?: string
}

export default function SummaryStrip({ summary, note }: SummaryStripProps) {
  const tier = tierClasses(winrateTier(summary.winrate))
  const cells: { label: string; value: string; className?: string }[] = [
    { label: "Games", value: String(summary.games) },
    { label: "Wins", value: String(summary.wins), className: "text-radiant" },
    { label: "Losses", value: String(summary.losses), className: "text-dire" },
    { label: "Win %", value: summary.games === 0 ? "—" : `${Math.round(summary.winrate)}%`, className: tier.text },
    { label: "Avg KDA", value: summary.games === 0 ? "—" : summary.avgKDA.toFixed(2), className: "text-mana" },
  ]

  return (
    <div className="panel brackets relative overflow-hidden p-5 md:p-6">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
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
