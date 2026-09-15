import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useToday } from "../../hooks/useToday"
import {
  durationRows,
  heroStats,
  hourRows,
  laneRows,
  localHourOffset,
  partyRows,
  positionRows,
  sideRows,
  summarize,
  timelineBuckets,
} from "../../lib/stats/aggregate"
import {
  customWindow,
  parseWindow,
  presetWindow,
  timelineGranularity,
  windowToParams,
} from "../../lib/stats/range"
import type { Preset } from "../../lib/stats/types"
import { useHeroesCatalog } from "../../services/heroes.service"
import { MAX_PAGES, PAGE_SIZE, usePlayerStats } from "../../services/stats.service"
import Spinner from "../Spinner"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import HeroTable from "./HeroTable"
import RangeFilter from "./RangeFilter"
import StatPanel from "./StatPanel"
import SummaryStrip from "./SummaryStrip"
import WinrateBars from "./WinrateBars"
import WinrateTimeline from "./WinrateTimeline"

export default function Stats() {
  const { playerId } = useParams<{ playerId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const heroes = useHeroesCatalog()

  const now = useToday()
  const window = useMemo(() => parseWindow(searchParams, now), [searchParams, now])

  const { status, data, pagesLoaded, matchesCovered, retry } = usePlayerStats(Number(playerId) || 0, window)

  const granularity = timelineGranularity(window)
  const derived = useMemo(() => {
    if (!data) return null
    return {
      summary: summarize(data.faction),
      side: sideRows(data.faction),
      roles: positionRows(data.position),
      lanes: laneRows(data.lane),
      party: partyRows(data.party),
      duration: durationRows(data.duration),
      hours: hourRows(data.hour, localHourOffset(now)),
      timeline: timelineBuckets(data.day, window, granularity),
      heroes: heroStats(data.hero),
    }
  }, [data, window, granularity, now])

  const onPreset = (preset: Preset) => setSearchParams(windowToParams(presetWindow(preset, new Date())))
  const onCustom = (from: Date, to: Date) => setSearchParams(windowToParams(customWindow(from, to, new Date())))

  return (
    <div className="container mt-6 flex flex-col gap-8 pb-10">
      <RangeFilter window={window} now={now} onPreset={onPreset} onCustom={onCustom} />

      {status === "loading" && (
        <>
          {pagesLoaded > 0 && (
            <div className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <Spinner />
              Aggregating {matchesCovered.toLocaleString()} matches…
            </div>
          )}
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </>
      )}

      {status === "error" && (
        <div className="panel brackets flex flex-col items-center gap-4 p-8 text-center">
          <div className="aegis-title gold-text-strong text-xl">Stats Unavailable</div>
          <p className="text-sm text-muted-foreground">Stratz did not answer. This is usually brief.</p>
          <Button onClick={retry}>Retry</Button>
        </div>
      )}

      {status === "empty" && (
        <div className="panel brackets flex flex-col items-center gap-4 p-8 text-center">
          <div className="aegis-title gold-text-strong text-xl">No Ranked Matches</div>
          <p className="text-sm text-muted-foreground">Nothing ranked was played in this window.</p>
          {!(window.kind === "preset" && window.preset === "1y") && (
            <Button variant="outline" onClick={() => onPreset("1y")}>
              Try last year
            </Button>
          )}
        </div>
      )}

      {status === "ready" && data && derived && (
        <>
          <SummaryStrip
            summary={derived.summary}
            note={
              data.capped
                ? `Based on the ${(MAX_PAGES * PAGE_SIZE).toLocaleString()} most recent ranked matches in this window`
                : undefined
            }
          />

          <div className="grid gap-8 md:grid-cols-2">
            <StatPanel title="Side">
              <WinrateBars rows={derived.side} />
            </StatPanel>
            <StatPanel title="Roles">
              <WinrateBars rows={derived.roles} />
            </StatPanel>
            <StatPanel title="Lanes">
              <WinrateBars rows={derived.lanes} />
            </StatPanel>
            <StatPanel title="Party vs Solo">
              <WinrateBars rows={derived.party} />
            </StatPanel>
          </div>

          <StatPanel title="Winrate over time">
            <WinrateTimeline buckets={derived.timeline} granularity={granularity} />
          </StatPanel>

          <div className="grid gap-8 md:grid-cols-2">
            <StatPanel title="Game length">
              <WinrateBars rows={derived.duration} />
            </StatPanel>
            <StatPanel title="Hour of day">
              <WinrateBars rows={derived.hours} />
            </StatPanel>
          </div>

          <StatPanel title="Heroes">
            <HeroTable rows={derived.heroes} heroes={heroes} />
          </StatPanel>
        </>
      )}
    </div>
  )
}
