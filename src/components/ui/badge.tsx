import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[10px] font-display uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-neon-purple/60 bg-neon-purple/15 text-neon-purple shadow-[inset_0_0_8px_hsl(var(--neon-purple)/0.25)] hover:bg-neon-purple/25",
        secondary:
          "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20",
        destructive:
          "border-neon-rose/70 bg-neon-rose/15 text-neon-rose hover:bg-neon-rose/25",
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
