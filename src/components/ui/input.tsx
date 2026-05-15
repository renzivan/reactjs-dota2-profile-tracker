import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-gold/40 bg-background/70 backdrop-blur-sm px-3 py-2 text-sm font-mono tracking-wide text-foreground ring-offset-background transition-all placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-[0.18em] placeholder:text-xs focus-visible:outline-none focus-visible:border-gold focus-visible:shadow-gold-sm focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
