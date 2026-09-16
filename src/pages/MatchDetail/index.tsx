import { useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import LeadChart from "../../components/MatchDetail/LeadChart"
import MatchSummary from "../../components/MatchDetail/MatchSummary"
import Scoreboard from "../../components/MatchDetail/Scoreboard"
import Spinner from "../../components/Spinner"
import StatPanel from "../../components/Stats/StatPanel"
import { splitTeams } from "../../lib/match/scoreboard"
import { useAbilitiesCatalog } from "../../services/abilities.service"
import { useHeroesCatalog } from "../../services/heroes.service"
import { useItemsCatalog } from "../../services/items.service"
import { useGetMatch } from "../../services/match.service"

/** Everything about one match: the result, the momentum, and both scoreboards. */
export function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>()
  const [searchParams] = useSearchParams()
  const { data: match, loading, isValidId } = useGetMatch(matchId)
  const heroes = useHeroesCatalog()
  const abilities = useAbilitiesCatalog()
  const items = useItemsCatalog()

  // Arriving from a match history row leaves the window scrolled down the list.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [matchId])

  const from = searchParams.get("from")
  const backTo = from ? `/profile/${from}` : "/"
  const backLabel = from ? "Back to profile" : "Back to search"

  const back = (
    <Link
      to={backTo}
      className="group inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
    >
      <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      {backLabel}
    </Link>
  )

  if (loading || !match) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24">
        {loading && (
          <>
            <div className="font-display text-xs uppercase tracking-[0.3em] gold-text">Summoning Match</div>
            <Spinner />
          </>
        )}
        {!loading && (
          <div className="panel brackets max-w-md p-6 text-center">
            <div className="aegis-title gold-text-strong mb-1 text-xl">Match Not Found</div>
            <div className="text-sm text-muted-foreground">
              {isValidId
                ? "Stratz has no record of this match."
                : "That does not look like a match id."}
            </div>
            <div className="mt-4">{back}</div>
          </div>
        )}
      </div>
    )
  }

  const { radiant, dire } = splitTeams(match.players)
  const highlightSteamId = Number(from) || undefined
  const hasMomentum = !!match.radiantNetworthLeads?.length || !!match.radiantExperienceLeads?.length

  const scoreboardProps = { heroes, abilities, items, highlightSteamId }

  return (
    <div className="container flex flex-col gap-6 py-6">
      {back}

      <MatchSummary match={match} />

      {hasMomentum && (
        <StatPanel title="Momentum">
          <div className="grid gap-8 lg:grid-cols-2">
            <LeadChart title="Net worth lead" values={match.radiantNetworthLeads} unit="gold" />
            <LeadChart title="Experience lead" values={match.radiantExperienceLeads} unit="XP" />
          </div>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground">
            Above the line is <span className="text-radiant">Radiant</span> ahead, below it is{" "}
            <span className="text-dire">Dire</span>.
          </p>
        </StatPanel>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xs uppercase tracking-[0.3em] gold-text">// Scoreboard</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <Scoreboard side="radiant" players={radiant} won={match.didRadiantWin} {...scoreboardProps} />
        <Scoreboard side="dire" players={dire} won={!match.didRadiantWin} {...scoreboardProps} />
      </div>
    </div>
  )
}
