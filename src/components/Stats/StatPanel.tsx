import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

type StatPanelProps = {
  title: string
  children: ReactNode
  className?: string
}

/** Section header in the "// Match History" style, then a panel body. */
export default function StatPanel({ title, children, className }: StatPanelProps) {
  return (
    <section className={cn("flex flex-col", className)}>
      <div className="mb-3 flex items-center gap-3">
        <span className="font-display text-xs uppercase tracking-[0.3em] gold-text">// {title}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
      </div>
      <div className="panel flex-1 p-4 md:p-5">{children}</div>
    </section>
  )
}
