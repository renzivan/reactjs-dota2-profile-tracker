import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-display uppercase tracking-wider ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer corner-cuts",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon hover:shadow-neon-pink hover:brightness-110",
        destructive:
          "bg-neon-rose text-white shadow-[0_0_18px_hsl(var(--neon-rose)/0.6)] hover:brightness-110",
        outline:
          "border border-neon-purple/60 bg-transparent text-foreground hover:bg-neon-purple/15 hover:shadow-neon-sm hover:text-neon-purple",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:border-neon-cyan/60 hover:text-neon-cyan",
        ghost:
          "hover:bg-neon-purple/10 hover:text-neon-purple",
        link:
          "text-neon-cyan underline-offset-4 hover:underline",
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
