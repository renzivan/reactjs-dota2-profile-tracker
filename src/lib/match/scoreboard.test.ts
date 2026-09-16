import { describe, expect, it } from 'vitest'
import type { MatchDetailPlayerType } from '../types'
import {
  abilityBuild,
  averageSeries,
  backpack,
  buildLeadChart,
  inventory,
  itemTimeline,
  laneOutcomeFor,
  lastSeries,
  leadAreaPaths,
  leadLinePath,
  splitTeams,
  sumSeries,
  teamTotals,
  wardCounts,
  winnerOf,
} from './scoreboard'

/** A player with only the fields a given test cares about. */
const player = (fields: Partial<MatchDetailPlayerType>) =>
  ({
    playerSlot: 0,
    isRadiant: true,
    kills: 0,
    deaths: 0,
    assists: 0,
    networth: 0,
    numLastHits: 0,
    numDenies: 0,
    heroDamage: 0,
    towerDamage: 0,
    heroHealing: 0,
    ...fields,
  }) as MatchDetailPlayerType

describe('splitTeams', () => {
  it('splits by side and orders each by player slot', () => {
    const players = [
      player({ playerSlot: 130, isRadiant: false, heroId: 3 }),
      player({ playerSlot: 2, heroId: 2 }),
      player({ playerSlot: 0, heroId: 1 }),
      player({ playerSlot: 128, isRadiant: false, heroId: 4 }),
    ]

    const { radiant, dire } = splitTeams(players)

    expect(radiant.map((it) => it.heroId)).toEqual([1, 2])
    expect(dire.map((it) => it.heroId)).toEqual([4, 3])
  })

  it('does not mutate the input', () => {
    const players = [player({ playerSlot: 4 }), player({ playerSlot: 1 })]
    splitTeams(players)

    expect(players.map((it) => it.playerSlot)).toEqual([4, 1])
  })

  it('handles a missing roster', () => {
    expect(splitTeams()).toEqual({ radiant: [], dire: [] })
  })
})

describe('teamTotals', () => {
  it('adds up the columns worth adding up', () => {
    const totals = teamTotals([
      player({ kills: 14, deaths: 2, assists: 21, networth: 30745, numLastHits: 376, numDenies: 15, heroDamage: 43577, towerDamage: 9934, heroHealing: 0 }),
      player({ kills: 3, deaths: 11, assists: 15, networth: 12000, numLastHits: 40, numDenies: 2, heroDamage: 9000, towerDamage: 100, heroHealing: 2500 }),
    ])

    expect(totals).toEqual({
      kills: 17,
      deaths: 13,
      assists: 36,
      networth: 42745,
      lastHits: 416,
      denies: 17,
      heroDamage: 52577,
      towerDamage: 10034,
      heroHealing: 2500,
    })
  })

  it('is all zeroes for no players', () => {
    expect(teamTotals([]).kills).toBe(0)
    expect(teamTotals().networth).toBe(0)
  })
})

describe('winnerOf', () => {
  it('names the winning side', () => {
    expect(winnerOf({ didRadiantWin: true })).toBe('radiant')
    expect(winnerOf({ didRadiantWin: false })).toBe('dire')
  })
})

describe('laneOutcomeFor', () => {
  it('mirrors the radiant-phrased enum for dire', () => {
    expect(laneOutcomeFor('RADIANT_VICTORY', 'radiant')).toEqual({ label: 'Won', tone: 'won' })
    expect(laneOutcomeFor('RADIANT_VICTORY', 'dire')).toEqual({ label: 'Lost', tone: 'lost' })
    expect(laneOutcomeFor('DIRE_STOMP', 'dire')).toEqual({ label: 'Stomp', tone: 'won' })
    expect(laneOutcomeFor('DIRE_STOMP', 'radiant')).toEqual({ label: 'Stomped', tone: 'lost' })
  })

  it('reads a tie, or no data at all, as even', () => {
    expect(laneOutcomeFor('TIE', 'radiant')).toEqual({ label: 'Even', tone: 'even' })
    expect(laneOutcomeFor(null, 'dire')).toEqual({ label: 'Even', tone: 'even' })
  })
})

describe('inventory and backpack', () => {
  const carry = player({
    item0Id: 220,
    item1Id: 223,
    item2Id: null,
    item3Id: 119,
    item4Id: 235,
    item5Id: 108,
    backpack0Id: 44,
    backpack1Id: null,
    backpack2Id: 0,
  })

  it('keeps empty inventory slots so the row stays fixed width', () => {
    expect(inventory(carry)).toEqual([220, 223, null, 119, 235, 108])
  })

  it('drops empty and zeroed backpack slots', () => {
    expect(backpack(carry)).toEqual([44])
  })
})

describe('abilityBuild', () => {
  it('orders the picks and numbers them by level spent', () => {
    const build = abilityBuild([
      { abilityId: 5370, time: 65, level: 0, isTalent: false },
      { abilityId: 5372, time: -89, level: 0, isTalent: false },
      { abilityId: 5761, time: 885, level: 0, isTalent: true },
    ])

    expect(build.map((it) => [it.abilityId, it.order])).toEqual([
      [5372, 1],
      [5370, 2],
      [5761, 3],
    ])
  })

  it('is empty when the replay has no ability data', () => {
    expect(abilityBuild(null)).toEqual([])
    expect(abilityBuild([])).toEqual([])
  })
})

describe('itemTimeline', () => {
  it('sorts purchases by the time they were bought', () => {
    const timeline = itemTimeline([
      { time: 108, itemId: 77 },
      { time: -89, itemId: 20 },
      { time: -89, itemId: 44 },
    ])

    expect(timeline.map((it) => it.itemId)).toEqual([20, 44, 77])
  })

  it('is empty for an unparsed match', () => {
    expect(itemTimeline(undefined)).toEqual([])
  })
})

describe('wardCounts', () => {
  it('splits observers from sentries', () => {
    expect(wardCounts([{ time: 1, type: 0 }, { time: 2, type: 1 }, { time: 3, type: 0 }])).toEqual({
      observer: 2,
      sentry: 1,
    })
  })

  it('is zeroes with no ward data', () => {
    expect(wardCounts(null)).toEqual({ observer: 0, sentry: 0 })
  })
})

describe('sumSeries and averageSeries', () => {
  it('totals and averages a per-minute series', () => {
    expect(sumSeries([1, 2, 3])).toBe(6)
    expect(averageSeries([300, 400, 401])).toBe(367)
  })

  it('does not divide by an empty series', () => {
    expect(averageSeries([])).toBe(0)
    expect(averageSeries(null)).toBe(0)
    expect(sumSeries(undefined)).toBe(0)
  })
})

describe('lastSeries', () => {
  it('reads a running total off its final entry', () => {
    expect(lastSeries([0, 0, 1, 1, 2, 2])).toBe(2)
  })

  it('is zero with nothing to read', () => {
    expect(lastSeries([])).toBe(0)
    expect(lastSeries(null)).toBe(0)
    expect(lastSeries(undefined)).toBe(0)
  })
})

describe('buildLeadChart', () => {
  it('normalises to a 0-100 box with zero at the middle', () => {
    const chart = buildLeadChart([0, 1000, -500])

    expect(chart?.peak).toBe(1000)
    expect(chart?.peakMinute).toBe(1)
    expect(chart?.points).toEqual([
      { minute: 0, value: 0, x: 0, y: 50 },
      { minute: 1, value: 1000, x: 50, y: 0 },
      { minute: 2, value: -500, x: 100, y: 75 },
    ])
  })

  it('draws an all-even game as a flat line instead of dividing by zero', () => {
    const chart = buildLeadChart([0, 0, 0])

    expect(chart?.peak).toBe(0)
    expect(chart?.points.map((it) => it.y)).toEqual([50, 50, 50])
  })

  it('places a single sample without dividing by zero', () => {
    expect(buildLeadChart([500])?.points).toEqual([{ minute: 0, value: 500, x: 0, y: 0 }])
  })

  it('is null when the match has no lead data', () => {
    expect(buildLeadChart(null)).toBeNull()
    expect(buildLeadChart([])).toBeNull()
  })
})

describe('leadLinePath and leadAreaPaths', () => {
  const chart = buildLeadChart([0, 1000, -500])!

  it('draws a polyline through every point', () => {
    expect(leadLinePath(chart)).toBe('M0.00,50.00 L50.00,0.00 L100.00,75.00')
  })

  it('clamps each filled half to its own side of the zero line', () => {
    const { above, below } = leadAreaPaths(chart)

    expect(above).toBe('M0.00,50 L0.00,50.00 L50.00,0.00 L100.00,50.00 L100.00,50 Z')
    expect(below).toBe('M0.00,50 L0.00,50.00 L50.00,50.00 L100.00,75.00 L100.00,50 Z')
  })
})
