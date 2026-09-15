import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import {
  MIN_SAMPLE,
  pickBestWorst,
  sortHeroes,
  winrateTier,
  type HeroSortKey,
  type HeroStat,
  type SortDir,
} from "../../lib/stats/aggregate"
import { tierClasses } from "../../lib/stats/tiers"
import type { HeroType } from "../../lib/types"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"

type HeroTableProps = {
  rows: HeroStat[]
  heroes: HeroType[]
}

const COLUMNS: { key: HeroSortKey; label: string; align: "left" | "right"; defaultDir: SortDir }[] = [
  { key: "name", label: "Hero", align: "left", defaultDir: "asc" },
  { key: "matches", label: "Games", align: "right", defaultDir: "desc" },
  { key: "wins", label: "Wins", align: "right", defaultDir: "desc" },
  { key: "winrate", label: "Win %", align: "right", defaultDir: "desc" },
  { key: "kda", label: "KDA", align: "right", defaultDir: "desc" },
  { key: "imp", label: "IMP", align: "right", defaultDir: "desc" },
]

const alignClass = (align: "left" | "right") => (align === "right" ? "text-right" : "text-left")

/** Cells are rendered in COLUMNS order, so a cell's alignment comes from its column. */
const alignOf = (index: number) => alignClass(COLUMNS[index].align)

export default function HeroTable({ rows, heroes }: HeroTableProps) {
  const [sortKey, setSortKey] = useState<HeroSortKey>("matches")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const heroById = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes])
  const nameOf = useCallback(
    (heroId: number) => heroById.get(heroId)?.displayName ?? `Hero ${heroId}`,
    [heroById],
  )

  const sorted = useMemo(() => sortHeroes(rows, sortKey, sortDir, nameOf), [rows, sortKey, sortDir, nameOf])
  const picks = useMemo(() => pickBestWorst(rows), [rows])

  const onSort = (key: HeroSortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir(COLUMNS.find((c) => c.key === key)?.defaultDir ?? "desc")
    }
  }

  if (rows.length === 0) {
    return (
      <p className="py-6 text-center font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
        No heroes played
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">Hero performance</caption>
        <thead>
          <tr className="border-b border-gold/25">
            {COLUMNS.map((col) => {
              const active = col.key === sortKey
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className={cn("px-3 py-2", alignClass(col.align))}
                >
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={cn(
                      "inline-flex items-center gap-1 font-display text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-gold",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                      active ? "text-gold" : "text-muted-foreground",
                    )}
                  >
                    {col.label}
                    {active &&
                      (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const hero = heroById.get(row.heroId)
            const shown = Math.round(row.winrate)
            const imp = Math.round(row.imp)
            const tier = tierClasses(winrateTier(shown))
            const lowSample = row.matches < MIN_SAMPLE
            return (
              <tr
                key={row.heroId}
                className={cn("border-b border-border/60 transition-colors hover:bg-gold/5", lowSample && "opacity-50")}
              >
                <td className={cn("px-3 py-2", alignOf(0))}>
                  <div className="flex items-center gap-3">
                    {hero ? (
                      <img
                        src={`https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_horz.png`}
                        onError={(e) => {
                          const img = e.currentTarget
                          if (img.dataset.fallback) return
                          img.dataset.fallback = "1"
                          img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png`
                        }}
                        alt=""
                        className="h-7 w-12 shrink-0 rounded-sm object-cover ring-1 ring-gold/25"
                      />
                    ) : (
                      <div aria-hidden className="h-7 w-12 shrink-0 rounded-sm bg-secondary ring-1 ring-gold/25" />
                    )}
                    <span className="font-display text-xs uppercase tracking-[0.12em]">{nameOf(row.heroId)}</span>
                    {picks.best === row.heroId && <Badge>Best</Badge>}
                    {picks.worst === row.heroId && <Badge variant="destructive">Worst</Badge>}
                  </div>
                </td>
                <td className={cn("px-3 py-2 font-mono", alignOf(1))}>{row.matches}</td>
                <td className={cn("px-3 py-2 font-mono text-radiant", alignOf(2))}>{row.wins}</td>
                <td className={cn("px-3 py-2 font-mono", alignOf(3), tier.text)}>{shown}%</td>
                <td className={cn("px-3 py-2 font-mono text-mana", alignOf(4))}>{row.kda.toFixed(2)}</td>
                <td className={cn("px-3 py-2 font-mono", alignOf(5), imp >= 0 ? "text-radiant" : "text-dire")}>
                  {imp > 0 ? `+${imp}` : imp}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
