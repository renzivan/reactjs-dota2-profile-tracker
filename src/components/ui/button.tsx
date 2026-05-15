import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-display uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[hsl(var(--gold-soft))] via-gold to-bronze text-[hsl(220_30%_8%)] shadow-gold hover:brightness-110 hover:shadow-[0_0_0_1px_hsl(var(--gold)/0.7),0_0_30px_-2px_hsl(var(--gold)/0.7)] border border-[hsl(var(--gold)/0.5)]",
        destructive:
          "bg-dire text-white shadow-dire hover:brightness-110 border border-[hsl(var(--dire)/0.6)]",
        outline:
          "border border-gold/50 bg-transparent text-gold hover:bg-gold/10 hover:shadow-gold-sm",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:border-gold/60 hover:text-gold",
        ghost:
          "hover:bg-gold/10 hover:text-gold",
        link:
          "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
