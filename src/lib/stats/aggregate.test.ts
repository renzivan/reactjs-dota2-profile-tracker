import { startOfDay } from 'date-fns'
import { describe, expect, it } from 'vitest'
import type { StatsPage } from './types'
import {
  MIN_SAMPLE,
  durationRows,
  heroStats,
  hourRows,
  laneRows,
  mergePages,
  partyRows,
  pickBestWorst,
  positionRows,
  sideRows,
  sortHeroes,
  summarize,
  timelineBuckets,
  utcDateToLocalDay,
  winrate,
  winrateTier,
} from './aggregate'
import { customWindow } from './range'

const emptyPage = (): StatsPage => ({
  faction: [], lane: [], position: [], hero: [], day: [], party: [], duration: [], hour: [],
})

describe('winrate', () => {
  it('is a percentage of wins over matches', () => {
    expect(winrate({ matchCount: 8, winCount: 6 })).toBe(75)
  })
  it('is 0 with no matches', () => {
    expect(winrate({ matchCount: 0, winCount: 0 })).toBe(0)
  })
})

describe('winrateTier', () => {
  it('is high from 55 up', () => {
    expect(winrateTier(55)).toBe('high')
    expect(winrateTier(80)).toBe('high')
  })
  it('is mid from 45 to under 55', () => {
    expect(winrateTier(45)).toBe('mid')
    expect(winrateTier(54.9)).toBe('mid')
  })
  it('is low under 45', () => {
    expect(winrateTier(44.9)).toBe('low')
  })
})

describe('mergePages', () => {
  it('sums counts for the same key across pages', () => {
    const a = { ...emptyPage(), faction: [{ isRadiant: true, matchCount: 10, winCount: 6, avgKDA: 3 }] }
    const b = { ...emptyPage(), faction: [{ isRadiant: true, matchCount: 30, winCount: 12, avgKDA: 5 }] }
    const merged = mergePages([a, b])
    expect(merged.faction).toEqual([{ isRadiant: true, matchCount: 40, winCount: 18, avgKDA: 4.5 }])
  })

  it('keeps disjoint keys', () => {
    const a = { ...emptyPage(), lane: [{ lane: 'MID_LANE', matchCount: 2, winCount: 1 }] }
    const b = { ...emptyPage(), lane: [{ lane: 'OFF_LANE', matchCount: 3, winCount: 3 }] }
    expect(mergePages([a, b]).lane).toEqual([
      { lane: 'MID_LANE', matchCount: 2, winCount: 1 },
      { lane: 'OFF_LANE', matchCount: 3, winCount: 3 },
    ])
  })

  it('weights hero averages by match count', () => {
    const a = { ...emptyPage(), hero: [{ heroId: 1, matchCount: 1, winCount: 1, avgKDA: 10, avgImp: 20 }] }
    const b = { ...emptyPage(), hero: [{ heroId: 1, matchCount: 3, winCount: 0, avgKDA: 2, avgImp: -4 }] }
    expect(mergePages([a, b]).hero).toEqual([{ heroId: 1, matchCount: 4, winCount: 1, avgKDA: 4, avgImp: 2 }])
  })

  it('merges every section independently', () => {
    const a = {
      ...emptyPage(),
      day: [{ dateDay: 100, matchCount: 1, winCount: 1 }],
      party: [{ isParty: false, matchCount: 1, winCount: 0 }],
      duration: [{ durationMinutes: 40, matchCount: 1, winCount: 1 }],
      hour: [{ hour: 3, matchCount: 1, winCount: 0 }],
      position: [{ position: 'POSITION_1', matchCount: 1, winCount: 1 }],
    }
    const merged = mergePages([a, a])
    expect(merged.day).toEqual([{ dateDay: 100, matchCount: 2, winCount: 2 }])
    expect(merged.party).toEqual([{ isParty: false, matchCount: 2, winCount: 0 }])
    expect(merged.duration).toEqual([{ durationMinutes: 40, matchCount: 2, winCount: 2 }])
    expect(merged.hour).toEqual([{ hour: 3, matchCount: 2, winCount: 0 }])
    expect(merged.position).toEqual([{ position: 'POSITION_1', matchCount: 2, winCount: 2 }])
  })

  it('returns an empty page for no pages', () => {
    expect(mergePages([])).toEqual(emptyPage())
  })
})

describe('summarize', () => {
  it('totals both sides and weights KDA by games', () => {
    const s = summarize([
      { isRadiant: true, matchCount: 9, winCount: 5, avgKDA: 4 },
      { isRadiant: false, matchCount: 1, winCount: 0, avgKDA: 1 },
    ])
    expect(s).toEqual({ games: 10, wins: 5, losses: 5, winrate: 50, avgKDA: 3.7 })
  })
  it('is all zeros with no rows', () => {
    expect(summarize([])).toEqual({ games: 0, wins: 0, losses: 0, winrate: 0, avgKDA: 0 })
  })
})

describe('bar rows', () => {
  it('sideRows labels and orders by games', () => {
    const rows = sideRows([
      { isRadiant: true, matchCount: 4, winCount: 1, avgKDA: 1 },
      { isRadiant: false, matchCount: 9, winCount: 2, avgKDA: 1 },
    ])
    expect(rows.map((r) => r.label)).toEqual(['Dire', 'Radiant'])
    expect(rows[0]).toMatchObject({ key: 'dire', matches: 9, wins: 2, icon: 'https://cdn.stratz.com/images/dota2/dire_square.png' })
  })

  it('positionRows maps positions to role names and icons', () => {
    const rows = positionRows([
      { position: 'POSITION_4', matchCount: 2, winCount: 1 },
      { position: 'POSITION_1', matchCount: 5, winCount: 4 },
    ])
    expect(rows[0]).toEqual({ key: 'POSITION_1', label: 'Carry', icon: '/roles/safe_lane.svg', matches: 5, wins: 4 })
    expect(rows[1]).toEqual({ key: 'POSITION_4', label: 'Soft Support', icon: '/roles/soft_support.svg', matches: 2, wins: 1 })
  })

  it('laneRows title-cases lanes', () => {
    const rows = laneRows([
      { lane: 'OFF_LANE', matchCount: 3, winCount: 1 },
      { lane: 'ROAMING', matchCount: 1, winCount: 1 },
    ])
    expect(rows.map((r) => r.label)).toEqual(['Off Lane', 'Roaming'])
  })

  it('partyRows labels party and solo', () => {
    const rows = partyRows([
      { isParty: true, matchCount: 3, winCount: 2 },
      { isParty: false, matchCount: 97, winCount: 50 },
    ])
    expect(rows.map((r) => r.label)).toEqual(['Solo', 'Party'])
  })

  it('durationRows buckets minutes in natural order and keeps empty buckets', () => {
    const rows = durationRows([
      { durationMinutes: 18, matchCount: 1, winCount: 0 },
      { durationMinutes: 34, matchCount: 2, winCount: 2 },
      { durationMinutes: 35, matchCount: 1, winCount: 0 },
      { durationMinutes: 70, matchCount: 1, winCount: 1 },
    ])
    expect(rows.map((r) => [r.label, r.matches, r.wins])).toEqual([
      ['< 25 min', 1, 0],
      ['25–34 min', 2, 2],
      ['35–44 min', 1, 0],
      ['45–59 min', 0, 0],
      ['60+ min', 1, 1],
    ])
  })

  it('hourRows shifts UTC hours to local and buckets into four hour blocks', () => {
    // 23:00 UTC at +10 is 09:00 local (08–11 block); 20:00 UTC at +10 is 06:00 local (04–07 block).
    const rows = hourRows(
      [
        { hour: 23, matchCount: 3, winCount: 3 },
        { hour: 20, matchCount: 2, winCount: 0 },
      ],
      10,
    )
    expect(rows.map((r) => r.label)).toEqual(['00–03', '04–07', '08–11', '12–15', '16–19', '20–23'])
    expect(rows[2]).toMatchObject({ matches: 3, wins: 3 })
    expect(rows[1]).toMatchObject({ matches: 2, wins: 0 })
  })

  it('hourRows handles negative offsets across midnight', () => {
    // 02:00 UTC at -5 is 21:00 local (20–23 block).
    const rows = hourRows([{ hour: 2, matchCount: 1, winCount: 1 }], -5)
    expect(rows[5]).toMatchObject({ matches: 1 })
  })
})

describe('MIN_SAMPLE', () => {
  it('is 5', () => {
    expect(MIN_SAMPLE).toBe(5)
  })
})

describe('utcDateToLocalDay', () => {
  it('reads the UTC calendar date as a local day', () => {
    // 1789084800 is 2026-09-11T00:00:00Z.
    expect(utcDateToLocalDay(1789084800)).toEqual(new Date(2026, 8, 11))
  })
})

describe('timelineBuckets', () => {
  const NOW = new Date(2026, 8, 15, 12)
  // Unix seconds for UTC midnight of a given local calendar date.
  const utcDay = (y: number, m: number, d: number) => Date.UTC(y, m, d) / 1000

  it('makes one daily bucket per day in the window, including empty ones', () => {
    const w = customWindow(new Date(2026, 8, 1), new Date(2026, 8, 5), NOW)
    const buckets = timelineBuckets(
      [
        { dateDay: utcDay(2026, 8, 1), matchCount: 3, winCount: 2 },
        { dateDay: utcDay(2026, 8, 4), matchCount: 1, winCount: 0 },
      ],
      w,
      'day',
    )
    expect(buckets.map((b) => [b.label, b.matches, b.wins])).toEqual([
      ['Sep 1', 3, 2],
      ['Sep 2', 0, 0],
      ['Sep 3', 0, 0],
      ['Sep 4', 1, 0],
      ['Sep 5', 0, 0],
    ])
    expect(buckets[0].start).toEqual(startOfDay(new Date(2026, 8, 1)))
  })

  it('makes weekly buckets starting Monday', () => {
    // Sep 1 2026 is a Tuesday, so the first week starts Mon Aug 31.
    const w = customWindow(new Date(2026, 8, 1), new Date(2026, 8, 20), NOW)
    const buckets = timelineBuckets(
      [
        { dateDay: utcDay(2026, 8, 1), matchCount: 2, winCount: 1 },
        { dateDay: utcDay(2026, 8, 6), matchCount: 1, winCount: 1 }, // Sunday, same week
        { dateDay: utcDay(2026, 8, 7), matchCount: 5, winCount: 2 }, // Monday, next week
      ],
      w,
      'week',
    )
    expect(buckets.map((b) => [b.label, b.matches, b.wins])).toEqual([
      ['Week of Aug 31', 3, 2],
      ['Week of Sep 7', 5, 2],
      ['Week of Sep 14', 0, 0],
    ])
  })

  it('ignores rows outside the window', () => {
    const w = customWindow(new Date(2026, 8, 1), new Date(2026, 8, 2), NOW)
    const buckets = timelineBuckets([{ dateDay: utcDay(2026, 7, 1), matchCount: 9, winCount: 9 }], w, 'day')
    expect(buckets.every((b) => b.matches === 0)).toBe(true)
  })
})

describe('heroStats and sortHeroes', () => {
  const rows = heroStats([
    { heroId: 1, matchCount: 10, winCount: 6, avgKDA: 3.2, avgImp: 5 },
    { heroId: 2, matchCount: 4, winCount: 4, avgKDA: 9, avgImp: 30 },
    { heroId: 3, matchCount: 10, winCount: 2, avgKDA: 1.1, avgImp: -12 },
  ])
  const nameOf = (id: number) => ({ 1: 'Axe', 2: 'Zeus', 3: 'Bane' })[id] ?? ''

  it('derives winrate per hero', () => {
    expect(rows.find((r) => r.heroId === 1)).toEqual({ heroId: 1, matches: 10, wins: 6, winrate: 60, kda: 3.2, imp: 5 })
  })

  it('sorts by matches desc with winrate desc as tiebreak by default', () => {
    expect(sortHeroes(rows, 'matches', 'desc', nameOf).map((r) => r.heroId)).toEqual([1, 3, 2])
  })

  it('sorts by name', () => {
    expect(sortHeroes(rows, 'name', 'asc', nameOf).map((r) => r.heroId)).toEqual([1, 3, 2])
    expect(sortHeroes(rows, 'name', 'desc', nameOf).map((r) => r.heroId)).toEqual([2, 3, 1])
  })

  it('sorts by numeric keys in either direction', () => {
    expect(sortHeroes(rows, 'kda', 'asc', nameOf).map((r) => r.heroId)).toEqual([3, 1, 2])
    expect(sortHeroes(rows, 'imp', 'desc', nameOf).map((r) => r.heroId)).toEqual([2, 1, 3])
  })

  it('does not mutate the input', () => {
    const before = rows.map((r) => r.heroId)
    sortHeroes(rows, 'winrate', 'asc', nameOf)
    expect(rows.map((r) => r.heroId)).toEqual(before)
  })
})

describe('pickBestWorst', () => {
  const stat = (heroId: number, matches: number, wins: number) =>
    heroStats([{ heroId, matchCount: matches, winCount: wins, avgKDA: 0, avgImp: 0 }])[0]

  it('picks highest and lowest winrate among heroes with enough games', () => {
    const picks = pickBestWorst([stat(1, 10, 8), stat(2, 10, 3), stat(3, 2, 2)])
    expect(picks).toEqual({ best: 1, worst: 2 })
  })

  it('breaks ties by more games', () => {
    const picks = pickBestWorst([stat(1, 5, 4), stat(2, 10, 8), stat(3, 5, 1), stat(4, 10, 2)])
    expect(picks).toEqual({ best: 2, worst: 4 })
  })

  it('returns nothing with fewer than two eligible heroes', () => {
    expect(pickBestWorst([stat(1, 10, 8), stat(2, 3, 0)])).toEqual({})
  })

  it('returns nothing when best and worst would be the same hero', () => {
    expect(pickBestWorst([stat(1, 10, 5), stat(2, 10, 5)])).toEqual({})
  })
})
