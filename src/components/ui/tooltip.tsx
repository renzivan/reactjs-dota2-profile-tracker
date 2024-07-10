import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    trigger: React.ReactNode;
    content: React.ReactNode;
    sideOffset?: number;
    className?: string;
  }
>(({ trigger, content, sideOffset = 4, className, ...props }, ref) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <span>{trigger}</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          className
        )}
        {...props}
      >
        {content}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
))
Tooltip.displayName = TooltipPrimitive.Content.displayName

export { Tooltip }
