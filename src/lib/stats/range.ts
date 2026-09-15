import {
  differenceInCalendarDays,
  endOfDay,
  format,
  isValid,
  parseISO,
  startOfDay,
  subDays,
  subYears,
} from 'date-fns'
import type { Preset, StatsWindow } from './types'

export const PRESETS: Record<Preset, { label: string; days: number }> = {
  '30d': { label: '30D', days: 30 },
  '90d': { label: '3M', days: 90 },
  '180d': { label: '6M', days: 180 },
  '1y': { label: '1Y', days: 365 },
}

export const PRESET_ORDER: Preset[] = ['30d', '90d', '180d', '1y']
export const DEFAULT_PRESET: Preset = '30d'

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/
const toSeconds = (d: Date) => Math.floor(d.getTime() / 1000)
const toDate = (seconds: number) => new Date(seconds * 1000)

export function isPreset(value: string | null): value is Preset {
  return value !== null && PRESET_ORDER.includes(value as Preset)
}

/** The earliest day a custom window may start: one year before today. */
export function earliestAllowed(now: Date): Date {
  return startOfDay(subYears(now, 1))
}

/**
 * Presets snap to day boundaries so the bounds, and therefore the Apollo
 * cache key, stay stable for the whole day.
 */
export function presetWindow(preset: Preset, now: Date): StatsWindow {
  return {
    kind: 'preset',
    preset,
    start: toSeconds(startOfDay(subDays(now, PRESETS[preset].days))),
    end: toSeconds(endOfDay(now)),
  }
}

export function customWindow(from: Date, to: Date, now: Date): StatsWindow {
  const min = earliestAllowed(now)
  const max = startOfDay(now)
  const clamp = (d: Date) => {
    const s = startOfDay(d)
    return s < min ? min : s > max ? max : s
  }
  let a = clamp(from)
  let b = clamp(to)
  if (a > b) [a, b] = [b, a]
  return {
    kind: 'custom',
    from: format(a, 'yyyy-MM-dd'),
    to: format(b, 'yyyy-MM-dd'),
    start: toSeconds(a),
    end: toSeconds(endOfDay(b)),
  }
}

function parseDay(value: string | null): Date | null {
  if (!value || !ISO_DAY.test(value)) return null
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : null
}

/** URL is the source of truth. Anything malformed falls back to the default preset. */
export function parseWindow(params: URLSearchParams, now: Date): StatsWindow {
  const from = parseDay(params.get('from'))
  const to = parseDay(params.get('to'))
  if (from && to) return customWindow(from, to, now)

  const range = params.get('range')
  return presetWindow(isPreset(range) ? range : DEFAULT_PRESET, now)
}

export function windowToParams(w: StatsWindow): Record<string, string> {
  return w.kind === 'preset' ? { range: w.preset } : { from: w.from, to: w.to }
}

export function windowDays(w: StatsWindow): number {
  return differenceInCalendarDays(toDate(w.end), toDate(w.start)) + 1
}

export function timelineGranularity(w: StatsWindow): 'day' | 'week' {
  return windowDays(w) <= 31 ? 'day' : 'week'
}

export function describeWindow(w: StatsWindow): string {
  const a = toDate(w.start)
  const b = toDate(w.end)
  const sameYear = a.getFullYear() === b.getFullYear()
  return `${format(a, sameYear ? 'MMM d' : 'MMM d, yyyy')} – ${format(b, 'MMM d, yyyy')}`
}
