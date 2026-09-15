import type {
  DurationRow,
  FactionRow,
  HourRow,
  LaneRow,
  PartyRow,
  PositionRow,
  StatsPage,
  WinRow,
} from './types'

/** Rows with fewer games than this render muted and are ignored for best/worst. */
export const MIN_SAMPLE = 5

export function winrate(row: WinRow): number {
  return row.matchCount === 0 ? 0 : (row.winCount / row.matchCount) * 100
}

export type WinrateTier = 'high' | 'mid' | 'low'

export function winrateTier(pct: number): WinrateTier {
  if (pct >= 55) return 'high'
  if (pct >= 45) return 'mid'
  return 'low'
}

/**
 * Merge rows that share a key: counts add, the listed average fields become a
 * match-count-weighted mean. Order of first appearance is preserved.
 */
function mergeBy<T extends WinRow>(
  rows: T[],
  keyOf: (row: T) => string,
  averaged: (keyof T)[] = [],
): T[] {
  const out = new Map<string, T>()
  for (const row of rows) {
    const key = keyOf(row)
    const existing = out.get(key)
    if (!existing) {
      out.set(key, { ...row })
      continue
    }
    const total = existing.matchCount + row.matchCount
    const merged = { ...existing } as T
    const writable = merged as unknown as Record<keyof T, number>
    for (const field of averaged) {
      const a = Number(existing[field]) * existing.matchCount
      const b = Number(row[field]) * row.matchCount
      writable[field] = total === 0 ? 0 : (a + b) / total
    }
    merged.matchCount = total
    merged.winCount = existing.winCount + row.winCount
    out.set(key, merged)
  }
  return [...out.values()]
}

export function mergePages(pages: StatsPage[]): StatsPage {
  return {
    faction: mergeBy(pages.flatMap((p) => p.faction), (r) => String(r.isRadiant), ['avgKDA']),
    lane: mergeBy(pages.flatMap((p) => p.lane), (r) => r.lane),
    position: mergeBy(pages.flatMap((p) => p.position), (r) => r.position),
    hero: mergeBy(pages.flatMap((p) => p.hero), (r) => String(r.heroId), ['avgKDA', 'avgImp']),
    day: mergeBy(pages.flatMap((p) => p.day), (r) => String(r.dateDay)),
    party: mergeBy(pages.flatMap((p) => p.party), (r) => String(r.isParty)),
    duration: mergeBy(pages.flatMap((p) => p.duration), (r) => String(r.durationMinutes)),
    hour: mergeBy(pages.flatMap((p) => p.hour), (r) => String(r.hour)),
  }
}

export type Summary = { games: number; wins: number; losses: number; winrate: number; avgKDA: number }

export function summarize(faction: FactionRow[]): Summary {
  const games = faction.reduce((n, r) => n + r.matchCount, 0)
  const wins = faction.reduce((n, r) => n + r.winCount, 0)
  const kdaWeighted = faction.reduce((n, r) => n + r.avgKDA * r.matchCount, 0)
  return {
    games,
    wins,
    losses: games - wins,
    winrate: games === 0 ? 0 : (wins / games) * 100,
    avgKDA: games === 0 ? 0 : kdaWeighted / games,
  }
}

export type BarRow = { key: string; label: string; icon?: string; matches: number; wins: number }

const byMatchesDesc = (a: BarRow, b: BarRow) => b.matches - a.matches

export function sideRows(rows: FactionRow[]): BarRow[] {
  return rows
    .map((r) => {
      const side = r.isRadiant ? 'radiant' : 'dire'
      return {
        key: side,
        label: r.isRadiant ? 'Radiant' : 'Dire',
        icon: `https://cdn.stratz.com/images/dota2/${side}_square.png`,
        matches: r.matchCount,
        wins: r.winCount,
      }
    })
    .sort(byMatchesDesc)
}

const POSITIONS: Record<string, { label: string; icon: string }> = {
  POSITION_1: { label: 'Carry', icon: '/roles/safe_lane.svg' },
  POSITION_2: { label: 'Mid', icon: '/roles/mid.svg' },
  POSITION_3: { label: 'Offlane', icon: '/roles/offlane.svg' },
  POSITION_4: { label: 'Soft Support', icon: '/roles/soft_support.svg' },
  POSITION_5: { label: 'Hard Support', icon: '/roles/hard_support.svg' },
}

export function positionRows(rows: PositionRow[]): BarRow[] {
  return rows
    .map((r) => {
      const meta = POSITIONS[r.position]
      return {
        key: r.position,
        label: meta?.label ?? titleCase(r.position),
        icon: meta?.icon,
        matches: r.matchCount,
        wins: r.winCount,
      }
    })
    .sort(byMatchesDesc)
}

function titleCase(constant: string): string {
  return constant
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function laneRows(rows: LaneRow[]): BarRow[] {
  return rows
    .map((r) => ({ key: r.lane, label: titleCase(r.lane), matches: r.matchCount, wins: r.winCount }))
    .sort(byMatchesDesc)
}

export function partyRows(rows: PartyRow[]): BarRow[] {
  return rows
    .map((r) => ({
      key: r.isParty ? 'party' : 'solo',
      label: r.isParty ? 'Party' : 'Solo',
      matches: r.matchCount,
      wins: r.winCount,
    }))
    .sort(byMatchesDesc)
}

const DURATION_BUCKETS = [
  { key: 'lt25', label: '< 25 min', min: 0, max: 24 },
  { key: '25-34', label: '25–34 min', min: 25, max: 34 },
  { key: '35-44', label: '35–44 min', min: 35, max: 44 },
  { key: '45-59', label: '45–59 min', min: 45, max: 59 },
  { key: '60+', label: '60+ min', min: 60, max: Infinity },
]

export function durationRows(rows: DurationRow[]): BarRow[] {
  return DURATION_BUCKETS.map((b) => {
    const inBucket = rows.filter((r) => r.durationMinutes >= b.min && r.durationMinutes <= b.max)
    return {
      key: b.key,
      label: b.label,
      matches: inBucket.reduce((n, r) => n + r.matchCount, 0),
      wins: inBucket.reduce((n, r) => n + r.winCount, 0),
    }
  })
}

const HOUR_BLOCKS = ['00–03', '04–07', '08–11', '12–15', '16–19', '20–23']

/** Whole-hour offset of the viewer's zone from UTC, e.g. 10 for Sydney standard time. */
export function localHourOffset(now: Date = new Date()): number {
  return Math.round(-now.getTimezoneOffset() / 60)
}

/** Stratz reports hours in UTC. Shift into local time, then bucket into six four-hour blocks. */
export function hourRows(rows: HourRow[], offsetHours: number): BarRow[] {
  const blocks = HOUR_BLOCKS.map((label, i) => ({ key: `h${i}`, label, matches: 0, wins: 0 }))
  for (const r of rows) {
    const local = (((r.hour + offsetHours) % 24) + 24) % 24
    const block = blocks[Math.floor(local / 4)]
    block.matches += r.matchCount
    block.wins += r.winCount
  }
  return blocks
}
