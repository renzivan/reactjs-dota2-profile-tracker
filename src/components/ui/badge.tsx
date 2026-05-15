import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[10px] font-display uppercase tracking-[0.2em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-gold/60 bg-gold/10 text-gold shadow-[inset_0_0_8px_hsl(var(--gold)/0.20)] hover:bg-gold/20",
        secondary:
          "border-mana/60 bg-mana/10 text-mana hover:bg-mana/20",
        destructive:
          "border-dire/70 bg-dire/15 text-dire hover:bg-dire/25",
        outline:
          "border-border text-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
