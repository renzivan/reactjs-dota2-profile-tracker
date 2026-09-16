import { useId, useState } from "react"
import { formatClock, formatCompactNumber } from "../../lib/match/format"
import { buildLeadChart, leadAreaPaths, leadLinePath } from "../../lib/match/scoreboard"

type LeadChartProps = {
  title: string
  /** Radiant's lead per game minute. A negative sample means Dire is ahead. */
  values: number[] | null | undefined
  /** What a sample counts, for the hover readout: "gold" or "XP". */
  unit: string
}

/**
 * Radiant's lead over the game, filled green above the zero line and red below
 * it. The geometry is normalised to a 0-100 box, so the SVG stretches to any
 * width and only the strokes are held at a fixed weight.
 */
export default function LeadChart({ title, values, unit }: LeadChartProps) {
  const gradientId = useId()
  const [hovered, setHovered] = useState<number | null>(null)
  const chart = buildLeadChart(values)

  if (!chart) return null

  const { points, peak, peakMinute } = chart
  const areas = leadAreaPaths(chart)
  const lastMinute = points[points.length - 1].minute
  const marker = hovered === null ? null : points[hovered]
  const leader = marker && marker.value !== 0 ? (marker.value > 0 ? "Radiant" : "Dire") : null

  const track = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - left) / width))

    setHovered(Math.round(ratio * (points.length - 1)))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</h3>
        <p className="font-mono text-[11px] text-muted-foreground">
          Peak{" "}
          <span className={peak === 0 ? "text-muted-foreground" : points[peakMinute].value > 0 ? "text-radiant" : "text-dire"}>
            {formatCompactNumber(peak)}
          </span>{" "}
          at {formatClock(peakMinute * 60)}
        </p>
      </div>

      <div
        className="relative cursor-crosshair"
        onMouseMove={track}
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label={`${title}: Radiant's peak lead reached ${peak} ${unit} at minute ${peakMinute}`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full">
          <defs>
            <linearGradient id={`${gradientId}-radiant`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--radiant))" stopOpacity="0.55" />
              <stop offset="100%" stopColor="hsl(var(--radiant))" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id={`${gradientId}-dire`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--dire))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--dire))" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          <path d={areas.above} fill={`url(#${gradientId}-radiant)`} />
          <path d={areas.below} fill={`url(#${gradientId}-dire)`} />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="hsl(var(--gold))"
            strokeOpacity="0.35"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={leadLinePath(chart)}
            fill="none"
            stroke="hsl(var(--gold))"
            strokeOpacity="0.85"
            strokeWidth="1.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {marker && (
            <line
              x1={marker.x}
              y1="0"
              x2={marker.x}
              y2="100"
              stroke="hsl(var(--gold))"
              strokeOpacity="0.5"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        <span className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] text-radiant/80">
          +{formatCompactNumber(peak)}
        </span>
        <span className="pointer-events-none absolute bottom-0 left-0 font-mono text-[10px] text-dire/80">
          -{formatCompactNumber(peak)}
        </span>

        {marker && (
          <div
            className="pointer-events-none absolute top-1 -translate-x-1/2 whitespace-nowrap rounded-sm border border-gold/40 bg-popover px-2 py-1 font-mono text-[10px] shadow-[0_0_24px_-6px_hsl(var(--gold)/0.30)]"
            style={{ left: `${Math.min(88, Math.max(12, marker.x))}%` }}
          >
            <span className="text-muted-foreground">{formatClock(marker.minute * 60)}</span>{" "}
            {leader ? (
              <>
                <span className={marker.value > 0 ? "text-radiant" : "text-dire"}>{leader}</span>{" "}
                <span className="text-gold">{formatCompactNumber(Math.abs(marker.value))}</span>
                <span className="text-muted-foreground"> {unit}</span>
              </>
            ) : (
              <span className="text-muted-foreground">even</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>0:00</span>
        <span>{formatClock(Math.floor(lastMinute / 2) * 60)}</span>
        <span>{formatClock(lastMinute * 60)}</span>
      </div>
    </div>
  )
}
