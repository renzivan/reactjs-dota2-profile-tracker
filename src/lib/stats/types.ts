export type Preset = '30d' | '90d' | '180d' | '1y'

/** A resolved date window. `start` and `end` are unix seconds, inclusive. */
export type StatsWindow =
  | { kind: 'preset'; preset: Preset; start: number; end: number }
  | { kind: 'custom'; from: string; to: string; start: number; end: number }

export type WinRow = { matchCount: number; winCount: number }

export type FactionRow = WinRow & { isRadiant: boolean; avgKDA: number }
export type LaneRow = WinRow & { lane: string }
export type PositionRow = WinRow & { position: string }
export type HeroRow = WinRow & { heroId: number; avgKDA: number; avgImp: number }
export type DayRow = WinRow & { dateDay: number }
export type PartyRow = WinRow & { isParty: boolean }
export type DurationRow = WinRow & { durationMinutes: number }
export type HourRow = WinRow & { hour: number }

/** One page of aggregates, exactly as the GraphQL aliases return them. */
export type StatsPage = {
  faction: FactionRow[]
  lane: LaneRow[]
  position: PositionRow[]
  hero: HeroRow[]
  day: DayRow[]
  party: PartyRow[]
  duration: DurationRow[]
  hour: HourRow[]
}

/** All pages merged, plus how much was covered. */
export type StatsData = StatsPage & {
  matchesCovered: number
  pages: number
  capped: boolean
}
