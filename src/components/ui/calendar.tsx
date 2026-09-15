import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"

import { cn } from "../../lib/utils"

export type { DateRange } from "react-day-picker"

export type CalendarProps = DayPickerProps

/**
 * react-day-picker v9 with the site's gold theme. No default stylesheet is
 * imported; every class below is ours so the picker matches the panels.
 */
function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("relative text-sm", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-6",
        month: "space-y-3",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "font-display text-xs uppercase tracking-[0.2em] text-gold",
        nav: "absolute inset-x-0 top-0 flex h-8 items-center justify-between",
        button_previous:
          "inline-flex h-7 w-7 items-center justify-center rounded-sm border border-gold/40 text-gold transition hover:bg-gold/10 disabled:opacity-30 disabled:pointer-events-none",
        button_next:
          "inline-flex h-7 w-7 items-center justify-center rounded-sm border border-gold/40 text-gold transition hover:bg-gold/10 disabled:opacity-30 disabled:pointer-events-none",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
        week: "mt-1 flex",
        day: "h-9 w-9 p-0 text-center font-mono text-xs",
        day_button: "h-9 w-9 rounded-sm transition-colors hover:bg-gold/10",
        selected: "bg-gold/20 text-gold",
        range_start: "rounded-l-sm bg-gold/30 text-gold",
        range_end: "rounded-r-sm bg-gold/30 text-gold",
        range_middle: "rounded-none bg-gold/10 text-foreground",
        today: "ring-1 ring-inset ring-gold/60",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/30 line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
