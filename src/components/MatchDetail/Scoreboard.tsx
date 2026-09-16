import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { AbilityConstantType, HeroType, ItemType, MatchDetailPlayerType } from "../../lib/types"
import { cn } from "../../lib/utils"
import { formatCompactNumber, formatRatio, kdaRatio } from "../../lib/match/format"
import { backpack, inventory, teamTotals, type TeamSide } from "../../lib/match/scoreboard"
import HeroImage from "../HeroImage"
import ItemIcon from "../ItemIcon"
import Items from "../Items"
import LevelCircle from "../LevelCircle"
import PlayerDetail from "./PlayerDetail"

type ScoreboardProps = {
  side: TeamSide
  players: MatchDetailPlayerType[]
  won: boolean
  heroes: HeroType[]
  abilities: AbilityConstantType[]
  items: ItemType[]
  /** The account the visitor arrived from, so their row is easy to find. */
  highlightSteamId?: number
}

type Column = { label: string; align: "left" | "right" }

const COLUMNS: Column[] = [
  { label: "Player", align: "left" },
  { label: "Lvl", align: "left" },
  { label: "K / D / A", align: "right" },
  { label: "KDA", align: "right" },
  { label: "LH / DN", align: "right" },
  { label: "GPM / XPM", align: "right" },
  { label: "Net", align: "right" },
  { label: "Hero dmg", align: "right" },
  { label: "Twr dmg", align: "right" },
  { label: "Heal", align: "right" },
  { label: "Items", align: "right" },
  // The caret, which needs no heading of its own.
  { label: "", align: "right" },
]

const cellClass = (align: "left" | "right") =>
  cn("whitespace-nowrap px-2.5 py-2 font-mono text-xs", align === "right" ? "text-right" : "text-left")

/** A player with no Steam account attached — an abandoned slot, or a bot. */
const playerName = (player: MatchDetailPlayerType) => player.steamAccount?.name || "Anonymous"

/**
 * One team's scoreboard. A row opens into everything that does not fit a
 * column, the way a match history row does: the whole row is the handle and
 * the caret on the right says so. Rows stay open until closed again, and the
 * player's name stays a link to their own profile.
 */
export default function Scoreboard({
  side,
  players,
  won,
  heroes,
  abilities,
  items,
  highlightSteamId,
}: ScoreboardProps) {
  const [openSlots, setOpenSlots] = useState<number[]>([])
  const totals = teamTotals(players)
  const sideText = side === "radiant" ? "radiant-text" : "dire-text"

  const toggle = (playerSlot: number) =>
    setOpenSlots((open) =>
      open.includes(playerSlot) ? open.filter((it) => it !== playerSlot) : [...open, playerSlot],
    )

  return (
    <section className={cn("panel overflow-hidden", side === "radiant" ? "stripe-radiant" : "stripe-dire")}>
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-gold/20 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 w-8 rounded-sm" alt="" />
          <h2 className={cn("aegis-title text-base", sideText)}>{side}</h2>
          <span
            className={cn(
              "rounded-sm border px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.2em]",
              won
                ? "border-radiant/60 bg-radiant/15 text-radiant"
                : "border-dire/60 bg-dire/15 text-dire",
            )}
          >
            {won ? "Victory" : "Defeat"}
          </span>
        </div>
        <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <div className="flex gap-1.5">
            <dt>Kills</dt>
            <dd className="text-foreground">{totals.kills}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Net worth</dt>
            <dd className="text-gold">{formatCompactNumber(totals.networth)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Hero damage</dt>
            <dd className="text-foreground">{formatCompactNumber(totals.heroDamage)}</dd>
          </div>
        </dl>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="border-b border-gold/15">
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-2.5 pb-2 pt-2.5 font-display text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground",
                    column.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {players.map((player) => {
            const hero = heroes.find((it) => it.id === player.heroId)
            const open = openSlots.includes(player.playerSlot)
            const highlighted = !!highlightSteamId && player.steamAccountId === highlightSteamId
            const bag = backpack(player)

            return (
              <tbody key={player.playerSlot} className="border-b border-gold/10 last:border-b-0">
                <tr
                  onClick={() => toggle(player.playerSlot)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gold/5",
                    highlighted && "bg-gold/10",
                  )}
                >
                  <td
                    className={cn("px-2.5 py-2", highlighted && "shadow-[inset_3px_0_0_hsl(var(--gold))]")}
                  >
                    <div className="flex items-center gap-2.5">
                      <HeroImage
                        displayName={hero?.displayName}
                        shortName={hero?.shortName}
                        className="w-16"
                      />
                      <div className="flex min-w-0 flex-col">
                        {player.steamAccountId ? (
                          <Link
                            to={`/profile/${player.steamAccountId}`}
                            onClick={(event) => event.stopPropagation()}
                            className="max-w-[10rem] truncate font-display text-xs text-foreground transition-colors hover:text-gold"
                          >
                            {playerName(player)}
                          </Link>
                        ) : (
                          <span className="max-w-[10rem] truncate font-display text-xs text-muted-foreground">
                            {playerName(player)}
                          </span>
                        )}
                        <span className="truncate font-mono text-[10px] text-muted-foreground">
                          {hero?.displayName ?? "Unknown hero"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-2">
                    <LevelCircle level={player.level} />
                  </td>
                  <td className={cellClass("right")}>
                    <span className="text-radiant">{player.kills}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-dire">{player.deaths}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-mana">{player.assists}</span>
                  </td>
                  <td className={cellClass("right")}>
                    {formatRatio(kdaRatio(player.kills, player.deaths, player.assists))}
                  </td>
                  <td className={cellClass("right")}>
                    {player.numLastHits}
                    <span className="text-muted-foreground"> / </span>
                    {player.numDenies}
                  </td>
                  <td className={cellClass("right")}>
                    {player.goldPerMinute}
                    <span className="text-muted-foreground"> / </span>
                    {player.experiencePerMinute}
                  </td>
                  <td className={cn(cellClass("right"), "text-gold")}>{formatCompactNumber(player.networth)}</td>
                  <td className={cellClass("right")}>{formatCompactNumber(player.heroDamage)}</td>
                  <td className={cellClass("right")}>{formatCompactNumber(player.towerDamage)}</td>
                  <td className={cellClass("right")}>{formatCompactNumber(player.heroHealing)}</td>
                  <td className="px-2.5 py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Items
                        matchItems={inventory(player)}
                        className="max-w-none flex-nowrap justify-end"
                        itemClassName="h-7 w-10"
                      />
                      {bag.length > 0 && (
                        <div className="flex items-center gap-1 border-l border-gold/20 pl-1.5">
                          {bag.map((itemId, index) => (
                            <ItemIcon
                              key={`${itemId}-${index}`}
                              itemId={itemId}
                              item={items.find((it) => it.id === itemId)}
                              className="h-5 w-7 opacity-70"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="pl-1 pr-3">
                    {/* No handler of its own: the click bubbles to the row, which owns the toggle. */}
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-label={`${open ? "Hide" : "Show"} details for ${playerName(player)}`}
                      className="flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ChevronDown
                        className={cn("h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-45")}
                      />
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="p-0">
                      <PlayerDetail player={player} hero={hero} abilities={abilities} items={items} />
                    </td>
                  </tr>
                )}
              </tbody>
            )
          })}

          <tfoot>
            <tr className="border-t border-gold/25 bg-gold/[0.04]">
              <td className="px-2.5 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Team
              </td>
              <td />
              <td className={cellClass("right")}>
                <span className="text-radiant">{totals.kills}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-dire">{totals.deaths}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-mana">{totals.assists}</span>
              </td>
              <td />
              <td className={cellClass("right")}>
                {totals.lastHits}
                <span className="text-muted-foreground"> / </span>
                {totals.denies}
              </td>
              <td />
              <td className={cn(cellClass("right"), "text-gold")}>{formatCompactNumber(totals.networth)}</td>
              <td className={cellClass("right")}>{formatCompactNumber(totals.heroDamage)}</td>
              <td className={cellClass("right")}>{formatCompactNumber(totals.towerDamage)}</td>
              <td className={cellClass("right")}>{formatCompactNumber(totals.heroHealing)}</td>
              <td />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
