import type {
  MatchAbilityEventType,
  MatchDetailPlayerType,
  MatchDetailType,
  MatchItemPurchaseType,
  MatchWardEventType,
} from "../types"

export type TeamSide = "radiant" | "dire"

export type TeamTotals = {
  kills: number
  deaths: number
  assists: number
  networth: number
  lastHits: number
  denies: number
  heroDamage: number
  towerDamage: number
  heroHealing: number
}

/**
 * Both teams in scoreboard order. Slots 0-4 are Radiant and 128-132 Dire, so
 * the slot sorts each side into the order the game itself shows.
 */
export function splitTeams(players: MatchDetailPlayerType[] = []) {
  const bySlot = (a: MatchDetailPlayerType, b: MatchDetailPlayerType) => a.playerSlot - b.playerSlot

  return {
    radiant: players.filter((player) => player.isRadiant).sort(bySlot),
    dire: players.filter((player) => !player.isRadiant).sort(bySlot),
  }
}

export function teamTotals(players: MatchDetailPlayerType[] = []): TeamTotals {
  return players.reduce<TeamTotals>(
    (totals, player) => ({
      kills: totals.kills + (player.kills ?? 0),
      deaths: totals.deaths + (player.deaths ?? 0),
      assists: totals.assists + (player.assists ?? 0),
      networth: totals.networth + (player.networth ?? 0),
      lastHits: totals.lastHits + (player.numLastHits ?? 0),
      denies: totals.denies + (player.numDenies ?? 0),
      heroDamage: totals.heroDamage + (player.heroDamage ?? 0),
      towerDamage: totals.towerDamage + (player.towerDamage ?? 0),
      heroHealing: totals.heroHealing + (player.heroHealing ?? 0),
    }),
    {
      kills: 0,
      deaths: 0,
      assists: 0,
      networth: 0,
      lastHits: 0,
      denies: 0,
      heroDamage: 0,
      towerDamage: 0,
      heroHealing: 0,
    },
  )
}

/**
 * Which side won, and how a given side's result reads. The winner is the one
 * field the API gives us directly, so everything else is derived from it.
 */
export function winnerOf(match: Pick<MatchDetailType, "didRadiantWin">): TeamSide {
  return match.didRadiantWin ? "radiant" : "dire"
}

/**
 * A lane outcome from the point of view of one side. The enum is always phrased
 * from Radiant's side, so Dire's copy is the mirror of it.
 */
export function laneOutcomeFor(outcome: string | null | undefined, side: TeamSide) {
  if (!outcome || outcome === "TIE") return { label: "Even", tone: "even" as const }

  const radiantWon = outcome.startsWith("RADIANT")
  const stomp = outcome.endsWith("STOMP")
  const won = side === "radiant" ? radiantWon : !radiantWon

  return {
    label: won ? (stomp ? "Stomp" : "Won") : stomp ? "Stomped" : "Lost",
    tone: won ? ("won" as const) : ("lost" as const),
  }
}

/** The six inventory slots in order, empty ones included so the row is fixed width. */
export function inventory(player: MatchDetailPlayerType) {
  return [player.item0Id, player.item1Id, player.item2Id, player.item3Id, player.item4Id, player.item5Id]
}

/** Backpack slots, empty ones dropped — most players end with none. */
export function backpack(player: MatchDetailPlayerType) {
  return [player.backpack0Id, player.backpack1Id, player.backpack2Id].filter(
    (id): id is number => typeof id === "number" && id > 0,
  )
}

export type AbilityPick = MatchAbilityEventType & {
  /** 1-based hero level the pick was spent on. */
  order: number
}

/**
 * The skill build in the order it was taken. Stratz returns the events sorted
 * already, but the order is what the build reads by, so it is made explicit.
 */
export function abilityBuild(abilities: MatchAbilityEventType[] | null | undefined): AbilityPick[] {
  if (!abilities?.length) return []

  return [...abilities]
    .sort((a, b) => a.time - b.time)
    .map((ability, index) => ({ ...ability, order: index + 1 }))
}

/**
 * Purchases in the order they were bought. Repeat buys of the same item are
 * kept — buying a second Branch is part of the build — but the pre-horn burst
 * that every player makes at -89s collapses into the same opening group.
 */
export function itemTimeline(purchases: MatchItemPurchaseType[] | null | undefined) {
  if (!purchases?.length) return []

  return [...purchases].sort((a, b) => a.time - b.time)
}

export function wardCounts(wards: MatchWardEventType[] | null | undefined) {
  const observer = wards?.filter((ward) => ward.type === 0).length ?? 0
  const sentry = wards?.filter((ward) => ward.type !== 0).length ?? 0

  return { observer, sentry }
}

export function sumSeries(values: number[] | null | undefined) {
  return values?.reduce((total, value) => total + value, 0) ?? 0
}

export function averageSeries(values: number[] | null | undefined) {
  if (!values?.length) return 0

  return Math.round(sumSeries(values) / values.length)
}

/**
 * The final value of a running total. Some per-minute series count up rather
 * than reporting that minute alone — stacked camps is the total so far, so
 * summing it would multiply the answer by the rest of the game.
 */
export function lastSeries(values: number[] | null | undefined) {
  if (!values?.length) return 0

  return values[values.length - 1]
}

export type LeadPoint = {
  /** Game minute this sample covers. */
  minute: number
  value: number
  /** 0-100 across the chart. */
  x: number
  /** 0-100 down the chart, with 50 the zero line. */
  y: number
}

export type LeadChart = {
  points: LeadPoint[]
  /** The largest absolute lead, which sets the vertical scale. */
  peak: number
  peakMinute: number
}

/**
 * Geometry for a lead-over-time chart, normalised to a 0-100 box so the SVG can
 * scale to any width. The zero line sits at y=50 and a positive lead goes up,
 * which is why the y axis is inverted here rather than in the component.
 */
export function buildLeadChart(values: number[] | null | undefined): LeadChart | null {
  if (!values?.length) return null

  const peak = Math.max(...values.map((value) => Math.abs(value)))
  const peakIndex = values.findIndex((value) => Math.abs(value) === peak)
  // A flat-zero game would divide by zero; any non-zero scale draws it as a line.
  const scale = peak === 0 ? 1 : peak
  const lastIndex = Math.max(1, values.length - 1)

  return {
    peak,
    peakMinute: peakIndex,
    points: values.map((value, index) => ({
      minute: index,
      value,
      x: (index / lastIndex) * 100,
      y: 50 - (value / scale) * 50,
    })),
  }
}

/** The `d` of a polyline through the points. */
export function leadLinePath(chart: LeadChart) {
  return chart.points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
}

/**
 * The same line closed back along the zero line, so it can be filled. Split in
 * two — above and below zero — so each half takes its side's colour.
 */
export function leadAreaPaths(chart: LeadChart) {
  const clamp = (side: "above" | "below") =>
    chart.points.map((point) => ({
      ...point,
      y: side === "above" ? Math.min(point.y, 50) : Math.max(point.y, 50),
    }))

  const close = (points: LeadPoint[]) => {
    if (!points.length) return ""
    const first = points[0]
    const last = points[points.length - 1]
    const line = points.map((point) => `L${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")

    return `M${first.x.toFixed(2)},50 ${line} L${last.x.toFixed(2)},50 Z`
  }

  return { above: close(clamp("above")), below: close(clamp("below")) }
}
