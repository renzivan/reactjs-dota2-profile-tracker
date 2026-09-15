import { describe, expect, it } from 'vitest'
import type { StatsPage } from './types'
import {
  MIN_SAMPLE,
  durationRows,
  hourRows,
  laneRows,
  mergePages,
  partyRows,
  positionRows,
  sideRows,
  summarize,
  winrate,
  winrateTier,
} from './aggregate'

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
