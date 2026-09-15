import { CalendarDays } from "lucide-react"
import { useState } from "react"
import { PRESETS, PRESET_ORDER, describeWindow, earliestAllowed } from "../../lib/stats/range"
import type { Preset, StatsWindow } from "../../lib/stats/types"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, type DateRange } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type RangeFilterProps = {
  window: StatsWindow
  now: Date
  onPreset: (preset: Preset) => void
  onCustom: (from: Date, to: Date) => void
}

const segment =
  "h-9 px-3 font-display text-[11px] uppercase tracking-[0.2em] border-b-2 transition-colors rounded-none"
const activeSegment = "!bg-gold/15 !text-gold border-gold"
const idleSegment = "border-transparent text-muted-foreground hover:!text-gold hover:bg-gold/5"

const seedFromWindow = (w: StatsWindow): DateRange | undefined =>
  w.kind === "custom" ? { from: new Date(w.start * 1000), to: new Date(w.end * 1000) } : undefined

export default function RangeFilter({ window, now, onPreset, onCustom }: RangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(() => seedFromWindow(window))

  /** Reseed from the current window on every open, so a stale or abandoned draft never sticks. */
  const onOpenChange = (next: boolean) => {
    if (next) setDraft(seedFromWindow(window))
    setOpen(next)
  }

  const apply = () => {
    if (draft?.from && draft.to) {
      onCustom(draft.from, draft.to)
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div role="group" aria-label="Date range" className="flex flex-wrap items-center gap-1 rounded-sm border border-border bg-card/60 p-1">
        {PRESET_ORDER.map((preset) => {
          const active = window.kind === "preset" && window.preset === preset
          return (
            <Button
              key={preset}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={active}
              onClick={() => onPreset(preset)}
              className={cn(segment, active ? activeSegment : idleSegment)}
            >
              {PRESETS[preset].label}
            </Button>
          )
        })}
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(segment, "gap-2", window.kind === "custom" ? activeSegment : idleSegment)}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Custom
            </Button>
          </PopoverTrigger>
          {/* Bounded to the space Radix measured, so two stacked months stay reachable on a short viewport. */}
          <PopoverContent
            aria-label="Custom date range"
            collisionPadding={8}
            className="max-h-[var(--radix-popover-content-available-height)] w-auto overflow-y-auto"
          >
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft?.from ?? new Date(now.getFullYear(), now.getMonth() - 1, 1)}
              startMonth={earliestAllowed(now)}
              endMonth={now}
              disabled={{ before: earliestAllowed(now), after: now }}
            />
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gold/20 pt-3">
              <span className="font-mono text-xs text-muted-foreground">
                {draft?.from && draft.to
                  ? describeWindow({
                      kind: "custom",
                      from: "",
                      to: "",
                      start: draft.from.getTime() / 1000,
                      end: draft.to.getTime() / 1000,
                    })
                  : "Pick a start and end day"}
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={apply} disabled={!draft?.from || !draft.to}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">{describeWindow(window)}</span>
        <Badge>Ranked only</Badge>
      </div>
    </div>
  )
}
