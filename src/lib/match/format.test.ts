import { describe, expect, it } from 'vitest'
import {
  countStandingBuildings,
  formatClock,
  formatCompactNumber,
  formatEnumLabel,
  formatMatchDate,
  formatRatio,
  formatSigned,
  kdaRatio,
} from './format'

describe('formatEnumLabel', () => {
  it('title-cases a screaming enum', () => {
    expect(formatEnumLabel('ALL_PICK_RANKED')).toBe('All Pick Ranked')
    expect(formatEnumLabel('RANKED')).toBe('Ranked')
    expect(formatEnumLabel('MID_LANE')).toBe('Mid Lane')
  })

  it('is empty for a missing value', () => {
    expect(formatEnumLabel(null)).toBe('')
    expect(formatEnumLabel(undefined)).toBe('')
    expect(formatEnumLabel('')).toBe('')
  })

  it('ignores doubled separators', () => {
    expect(formatEnumLabel('SOLO__MID')).toBe('Solo Mid')
  })
})

describe('formatClock', () => {
  it('reads as a game clock', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(9)).toBe('0:09')
    expect(formatClock(2309)).toBe('38:29')
  })

  it('keeps the sign on pre-horn times', () => {
    expect(formatClock(-89)).toBe('-1:29')
    expect(formatClock(-5)).toBe('-0:05')
  })
})

describe('formatCompactNumber', () => {
  it('leaves sub-thousands alone', () => {
    expect(formatCompactNumber(0)).toBe('0')
    expect(formatCompactNumber(999)).toBe('999')
  })

  it('shortens thousands to one decimal', () => {
    expect(formatCompactNumber(1000)).toBe('1.0k')
    expect(formatCompactNumber(30745)).toBe('30.7k')
    expect(formatCompactNumber(-2400)).toBe('-2.4k')
  })

  it('has a dash for a missing number', () => {
    expect(formatCompactNumber(Number.NaN)).toBe('—')
  })
})

describe('formatSigned', () => {
  it('only adds a plus, since a minus is already there', () => {
    expect(formatSigned(27)).toBe('+27')
    expect(formatSigned(-8)).toBe('-8')
    expect(formatSigned(0)).toBe('0')
  })
})

describe('formatMatchDate', () => {
  it('reads as a day and a time', () => {
    const ts = Math.floor(new Date(2026, 8, 13, 21, 38).getTime() / 1000)

    expect(formatMatchDate(ts)).toBe('Sep 13, 2026 · 9:38 PM')
  })
})

describe('countStandingBuildings', () => {
  it('counts the set bits of the mask', () => {
    expect(countStandingBuildings(2047)).toBe(11)
    expect(countStandingBuildings(1975)).toBe(9)
    expect(countStandingBuildings(63)).toBe(6)
    expect(countStandingBuildings(0)).toBe(0)
  })

  it('treats a missing mask as nothing standing', () => {
    expect(countStandingBuildings(null)).toBe(0)
    expect(countStandingBuildings(undefined)).toBe(0)
  })
})

describe('kdaRatio', () => {
  it('is kills and assists over deaths', () => {
    expect(kdaRatio(14, 2, 21)).toBe(17.5)
    expect(formatRatio(kdaRatio(3, 11, 15))).toBe('1.6')
  })

  it('reads a deathless game as the raw total', () => {
    expect(kdaRatio(5, 0, 7)).toBe(12)
  })
})
