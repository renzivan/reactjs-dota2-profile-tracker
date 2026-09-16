import { MatchDetailType } from "../../lib/types"
import { cn, getRankName } from "../../lib/utils"
import {
  countStandingBuildings,
  formatClock,
  formatEnumLabel,
  formatMatchDate,
} from "../../lib/match/format"
import { laneOutcomeFor, splitTeams, teamTotals, winnerOf, type TeamSide } from "../../lib/match/scoreboard"
import RankTier from "../RankTier"
import { Tooltip } from "../ui/tooltip"

type MatchSummaryProps = {
  match: MatchDetailType
}

/** A label above its value, the shape every fact in the meta strip takes. */
const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
    <span className="font-mono text-xs text-foreground">{children}</span>
  </div>
)

/**
 * One side's banner: its sigil, whether it won, and what it had left standing.
 * Dire mirrors to the right of the score, but only once the two sides sit
 * either side of it — stacked on a phone, both read from the left.
 */
const TeamBanner = ({
  side,
  won,
  towers,
  barracks,
}: {
  side: TeamSide
  won: boolean
  towers: number
  barracks: number
}) => {
  const mirrored = side === "dire"

  return (
    <div className={cn("flex flex-col gap-2 items-start", mirrored && "md:items-end")}>
      <div className={cn("flex items-center gap-2.5", mirrored && "md:flex-row-reverse")}>
        <img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-9 w-9 rounded-sm" alt="" />
        <div className={cn("flex flex-col items-start", mirrored && "md:items-end")}>
          <span className={cn("aegis-title text-base", mirrored ? "dire-text" : "radiant-text")}>{side}</span>
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {won ? "Victory" : "Defeat"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
        <span>
          Towers <span className="text-gold">{towers}</span>/11
        </span>
        <span>
          Racks <span className="text-gold">{barracks}</span>/6
        </span>
      </div>
    </div>
  )
}

const laneToneClass = (tone: "won" | "lost" | "even") =>
  tone === "won" ? "text-radiant" : tone === "lost" ? "text-dire" : "text-muted-foreground"

/**
 * The header of the match page: who won, by how much, and the handful of facts
 * that frame every other number on the page.
 */
export default function MatchSummary({ match }: MatchSummaryProps) {
  const { radiant, dire } = splitTeams(match.players)
  const radiantTotals = teamTotals(radiant)
  const direTotals = teamTotals(dire)
  const winner = winnerOf(match)
  const lanes = [
    { label: "Top", outcome: match.topLaneOutcome },
    { label: "Mid", outcome: match.midLaneOutcome },
    { label: "Bot", outcome: match.bottomLaneOutcome },
  ]

  return (
    <div className="panel brackets relative overflow-hidden p-6 md:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full blur-3xl ${
          winner === "radiant" ? "bg-radiant/10" : "bg-dire/10"
        }`}
      />

      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Match · {match.id}
      </div>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <TeamBanner
          side="radiant"
          won={match.didRadiantWin}
          towers={countStandingBuildings(match.towerStatusRadiant)}
          barracks={countStandingBuildings(match.barracksStatusRadiant)}
        />

        <div className="flex flex-col items-center gap-1">
          <div
            className={`aegis-title text-xl md:text-2xl ${winner === "radiant" ? "radiant-text" : "dire-text"}`}
          >
            {winner} Victory
          </div>
          <div className="flex items-baseline gap-3 font-mono text-3xl md:text-4xl">
            <span className="text-radiant">{radiantTotals.kills}</span>
            <span className="text-xl text-muted-foreground">–</span>
            <span className="text-dire">{direTotals.kills}</span>
          </div>
          <div className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {formatClock(match.durationSeconds)} · {formatEnumLabel(match.gameMode)}
          </div>
        </div>

        <TeamBanner
          side="dire"
          won={!match.didRadiantWin}
          towers={countStandingBuildings(match.towerStatusDire)}
          barracks={countStandingBuildings(match.barracksStatusDire)}
        />
      </div>

      <div className="rule-gold my-6" />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Fact label="Ended">{formatMatchDate(match.endDateTime)}</Fact>
        <Fact label="Lobby">{formatEnumLabel(match.lobbyType) || "Unknown"}</Fact>
        <Fact label="First blood">
          {typeof match.firstBloodTime === "number" ? formatClock(match.firstBloodTime) : "None"}
        </Fact>
        <Fact label="Lanes">
          <span className="flex items-center gap-2.5">
            {lanes.map((lane) => {
              const { label, tone } = laneOutcomeFor(lane.outcome, "radiant")

              return (
                <Tooltip
                  key={lane.label}
                  trigger={
                    <span className="cursor-default">
                      {lane.label} <span className={laneToneClass(tone)}>{label}</span>
                    </span>
                  }
                  content={<p>{lane.label} lane, from Radiant's side</p>}
                />
              )
            })}
          </span>
        </Fact>
        {!!match.bracket && (
          <div className="ml-auto flex items-center gap-3">
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Bracket</span>
              <span className="font-mono text-xs text-gold">{getRankName(match.bracket)}</span>
            </div>
            <RankTier rank={match.rank ?? 0} className="w-12" />
          </div>
        )}
      </div>
    </div>
  )
}
