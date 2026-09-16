import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { AbilityConstantType, HeroType, ItemType, MatchDetailPlayerType } from "../../lib/types"
import { cn } from "../../lib/utils"
import { formatCompactNumber, formatRatio, kdaRatio } from "../../lib/match/format"
import { inventory, teamTotals, type TeamSide } from "../../lib/match/scoreboard"
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion"
import HeroImage from "../HeroImage"
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

type Column = {
  label: string
  align: "left" | "right"
  /** A grid track. Every column but the player's is a fixed width. */
  track: string
}

const COLUMNS: Column[] = [
  { label: "Player", align: "left", track: "minmax(13rem, 1fr)" },
  { label: "Lvl", align: "left", track: "60px" },
  // Wide enough for a team total, which runs to three digits.
  { label: "K / D / A", align: "right", track: "116px" },
  { label: "KDA", align: "right", track: "52px" },
  { label: "LH / DN", align: "right", track: "92px" },
  { label: "GPM / XPM", align: "right", track: "104px" },
  { label: "Net", align: "right", track: "68px" },
  { label: "Hero dmg", align: "right", track: "96px" },
  { label: "Twr dmg", align: "right", track: "88px" },
  { label: "Heal", align: "right", track: "60px" },
  // Six slots at 40px, with the gaps between them and the cell's padding.
  { label: "Items", align: "right", track: "284px" },
]

/**
 * One grid, shared by the header, every row and the totals — and by both
 * teams, since the tracks are fixed. A table sized each column to its own
 * content, which left the two scoreboards a few pixels out of step.
 */
const GRID = { gridTemplateColumns: COLUMNS.map((column) => column.track).join(" ") }

/**
 * A row's padding: the trigger's own px-4, plus the 16px the caret occupies at
 * its right end. The header and totals rows carry it too, so their cells line
 * up with the cells of a row.
 */
const ROW_INSET = "pl-4 pr-8"

const cellClass = (align: "left" | "right") =>
  cn("truncate px-2.5 font-mono text-xs", align === "right" ? "text-right" : "text-left")

/** A player with no Steam account attached — an abandoned slot, or a bot. */
const playerName = (player: MatchDetailPlayerType) => player.steamAccount?.name || "Anonymous"

/**
 * One team's scoreboard. A row opens the way a match history row does — the
 * whole row is the handle, the caret on the right says so, and it slides. Rows
 * are independent, so one that was opened stays open, and the player's name
 * stays a link to their own profile.
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
  const totals = teamTotals(players)
  const sideText = side === "radiant" ? "radiant-text" : "dire-text"

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
        <div className="min-w-[1180px]">
          <div className={cn("grid border-b border-gold/15 py-2", ROW_INSET)} style={GRID} role="row">
            {COLUMNS.map((column) => (
              <div
                key={column.label}
                role="columnheader"
                className={cn(
                  "truncate px-2.5 font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
                  column.align === "right" ? "text-right" : "text-left",
                )}
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* Multiple, so opening a row leaves the ones already open alone. */}
          <Accordion type="multiple">
            {players.map((player) => {
              const hero = heroes.find((it) => it.id === player.heroId)
              const highlighted = !!highlightSteamId && player.steamAccountId === highlightSteamId

              return (
                <AccordionItem
                  key={player.playerSlot}
                  value={String(player.playerSlot)}
                  className="w-full border-0 border-b border-gold/10 last:border-b-0"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger asChild>
                      {/*
                        A div rather than the usual button: the row holds a link
                        to the player's profile, which cannot live inside one.
                        Enter and Space are wired up by hand in its place.
                      */}
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" && event.key !== " ") return
                          event.preventDefault()
                          event.currentTarget.click()
                        }}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center py-2 transition-colors hover:bg-gold/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                          "[&[data-state=open]>svg]:rotate-45",
                          ROW_INSET,
                          highlighted && "bg-gold/10 shadow-[inset_3px_0_0_hsl(var(--gold))]",
                        )}
                      >
                        <div className="grid flex-1 items-center" style={GRID}>
                          <div className="flex min-w-0 items-center gap-2.5 px-2.5">
                            <HeroImage
                              displayName={hero?.displayName}
                              shortName={hero?.shortName}
                              className="w-16"
                            />
                            <div className="flex min-w-0 flex-col text-left">
                              {player.steamAccountId ? (
                                <Link
                                  to={`/profile/${player.steamAccountId}`}
                                  onClick={(event) => event.stopPropagation()}
                                  className="truncate font-display text-xs text-foreground transition-colors hover:text-gold"
                                >
                                  {playerName(player)}
                                </Link>
                              ) : (
                                <span className="truncate font-display text-xs text-muted-foreground">
                                  {playerName(player)}
                                </span>
                              )}
                              <span className="truncate font-mono text-[10px] text-muted-foreground">
                                {hero?.displayName ?? "Unknown hero"}
                              </span>
                            </div>
                          </div>

                          <div className="px-2.5">
                            <LevelCircle level={player.level} />
                          </div>
                          <div className={cellClass("right")}>
                            <span className="text-radiant">{player.kills}</span>
                            <span className="text-muted-foreground"> / </span>
                            <span className="text-dire">{player.deaths}</span>
                            <span className="text-muted-foreground"> / </span>
                            <span className="text-mana">{player.assists}</span>
                          </div>
                          <div className={cellClass("right")}>
                            {formatRatio(kdaRatio(player.kills, player.deaths, player.assists))}
                          </div>
                          <div className={cellClass("right")}>
                            {player.numLastHits}
                            <span className="text-muted-foreground"> / </span>
                            {player.numDenies}
                          </div>
                          <div className={cellClass("right")}>
                            {player.goldPerMinute}
                            <span className="text-muted-foreground"> / </span>
                            {player.experiencePerMinute}
                          </div>
                          <div className={cn(cellClass("right"), "text-gold")}>
                            {formatCompactNumber(player.networth)}
                          </div>
                          <div className={cellClass("right")}>{formatCompactNumber(player.heroDamage)}</div>
                          <div className={cellClass("right")}>{formatCompactNumber(player.towerDamage)}</div>
                          <div className={cellClass("right")}>{formatCompactNumber(player.heroHealing)}</div>
                          <div className="px-2.5">
                            <Items
                              matchItems={inventory(player)}
                              className="max-w-none flex-nowrap justify-end"
                              itemClassName="h-7 w-10"
                            />
                          </div>
                        </div>

                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      </div>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionContent className="p-0">
                    <PlayerDetail player={player} hero={hero} abilities={abilities} items={items} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          <div
            className={cn("grid border-t border-gold/25 bg-gold/[0.04] py-2", ROW_INSET)}
            style={GRID}
            role="row"
          >
            <div className="truncate px-2.5 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Team
            </div>
            <div />
            <div className={cellClass("right")}>
              <span className="text-radiant">{totals.kills}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-dire">{totals.deaths}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-mana">{totals.assists}</span>
            </div>
            <div />
            <div className={cellClass("right")}>
              {totals.lastHits}
              <span className="text-muted-foreground"> / </span>
              {totals.denies}
            </div>
            <div />
            <div className={cn(cellClass("right"), "text-gold")}>{formatCompactNumber(totals.networth)}</div>
            <div className={cellClass("right")}>{formatCompactNumber(totals.heroDamage)}</div>
            <div className={cellClass("right")}>{formatCompactNumber(totals.towerDamage)}</div>
            <div className={cellClass("right")}>{formatCompactNumber(totals.heroHealing)}</div>
            <div />
          </div>
        </div>
      </div>
    </section>
  )
}
