import { describe, expect, it } from 'vitest'
import { endOfDay, startOfDay } from 'date-fns'
import {
  customWindow,
  describeWindow,
  parseWindow,
  presetWindow,
  timelineGranularity,
  windowDays,
  windowToParams,
} from './range'

// Local noon on 15 Sep 2026. Every expectation below is in local time.
const NOW = new Date(2026, 8, 15, 12, 0, 0)
const secs = (d: Date) => Math.floor(d.getTime() / 1000)
const params = (q: string) => new URLSearchParams(q)

describe('parseWindow', () => {
  it('defaults to the last 30 days with no params', () => {
    const w = parseWindow(params(''), NOW)
    expect(w).toMatchObject({ kind: 'preset', preset: '30d' })
    expect(w.start).toBe(secs(startOfDay(new Date(2026, 7, 16))))
    expect(w.end).toBe(secs(endOfDay(NOW)))
  })

  it('reads each preset', () => {
    expect(parseWindow(params('range=90d'), NOW)).toMatchObject({ preset: '90d' })
    expect(parseWindow(params('range=180d'), NOW)).toMatchObject({ preset: '180d' })
    expect(parseWindow(params('range=1y'), NOW)).toMatchObject({ preset: '1y' })
  })

  it('falls back to 30 days for an unknown range', () => {
    expect(parseWindow(params('range=7d'), NOW)).toMatchObject({ preset: '30d' })
  })

  it('reads a custom window inclusive of both days', () => {
    const w = parseWindow(params('from=2026-08-01&to=2026-08-10'), NOW)
    expect(w).toMatchObject({ kind: 'custom', from: '2026-08-01', to: '2026-08-10' })
    expect(w.start).toBe(secs(startOfDay(new Date(2026, 7, 1))))
    expect(w.end).toBe(secs(endOfDay(new Date(2026, 7, 10))))
  })

  it('prefers a custom window over a preset when both are present', () => {
    const w = parseWindow(params('range=1y&from=2026-08-01&to=2026-08-10'), NOW)
    expect(w.kind).toBe('custom')
  })

  it('falls back to 30 days when only one of from/to is present', () => {
    expect(parseWindow(params('from=2026-08-01'), NOW)).toMatchObject({ preset: '30d' })
    expect(parseWindow(params('to=2026-08-01'), NOW)).toMatchObject({ preset: '30d' })
  })

  it('falls back to 30 days for unparseable dates', () => {
    expect(parseWindow(params('from=yesterday&to=today'), NOW)).toMatchObject({ preset: '30d' })
    expect(parseWindow(params('from=2026-13-40&to=2026-08-01'), NOW)).toMatchObject({ preset: '30d' })
  })

  it('clamps from to one year before today', () => {
    const w = parseWindow(params('from=2020-01-01&to=2026-08-01'), NOW)
    expect(w).toMatchObject({ from: '2025-09-15', to: '2026-08-01' })
  })

  it('clamps to to today', () => {
    const w = parseWindow(params('from=2026-08-01&to=2030-01-01'), NOW)
    expect(w).toMatchObject({ from: '2026-08-01', to: '2026-09-15' })
    expect(w.end).toBe(secs(endOfDay(NOW)))
  })

  it('swaps from and to when reversed', () => {
    const w = parseWindow(params('from=2026-08-10&to=2026-08-01'), NOW)
    expect(w).toMatchObject({ from: '2026-08-01', to: '2026-08-10' })
  })
})

describe('windowToParams', () => {
  it('round-trips a preset', () => {
    expect(windowToParams(presetWindow('90d', NOW))).toEqual({ range: '90d' })
  })

  it('round-trips a custom window', () => {
    const w = customWindow(new Date(2026, 7, 1), new Date(2026, 7, 10), NOW)
    expect(windowToParams(w)).toEqual({ from: '2026-08-01', to: '2026-08-10' })
  })
})

describe('windowDays and timelineGranularity', () => {
  it('counts the 30 day preset as 31 calendar days and uses daily buckets', () => {
    const w = presetWindow('30d', NOW)
    expect(windowDays(w)).toBe(31)
    expect(timelineGranularity(w)).toBe('day')
  })

  it('uses weekly buckets for 3 months', () => {
    expect(timelineGranularity(presetWindow('90d', NOW))).toBe('week')
  })

  it('counts a two day custom window as 2', () => {
    const w = customWindow(new Date(2026, 7, 1), new Date(2026, 7, 2), NOW)
    expect(windowDays(w)).toBe(2)
  })
})

describe('describeWindow', () => {
  it('shows the year once when both ends share it', () => {
    expect(describeWindow(presetWindow('30d', NOW))).toBe('Aug 16 – Sep 15, 2026')
  })

  it('shows both years when they differ', () => {
    expect(describeWindow(presetWindow('1y', NOW))).toBe('Sep 15, 2025 – Sep 15, 2026')
  })
})
