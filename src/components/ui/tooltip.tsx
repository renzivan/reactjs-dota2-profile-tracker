import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../lib/utils"

interface TooltipProps {
  trigger: React.ReactNode
  content: React.ReactNode
  sideOffset?: number
  className?: string
  /** Classes for the element that wraps the trigger. */
  triggerClassName?: string
  /**
   * Also open on click, and stay open until clicked again. Hover alone does
   * not exist on touch, and some triggers — a talent branch, say — are worth
   * a deliberate look rather than a passing one.
   */
  pinnable?: boolean
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ trigger, content, sideOffset = 4, className, triggerClassName, pinnable, ...props }, ref) => {
    const [pinned, setPinned] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    // Radix closes on click, which is what a pin has to survive: the click
    // turns the pin on after that, so the tooltip stays until the next one.
    const controlled = pinnable
      ? { open: pinned || hovered, onOpenChange: setHovered }
      : {}

    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root {...controlled}>
          <TooltipPrimitive.Trigger asChild>
            {pinnable ? (
              <button
                type="button"
                onClick={() => setPinned((it) => !it)}
                aria-pressed={pinned}
                className={cn("cursor-pointer", triggerClassName)}
              >
                {trigger}
              </button>
            ) : (
              <span className={triggerClassName}>{trigger}</span>
            )}
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              ref={ref}
              sideOffset={sideOffset}
              className={cn(
                "z-50 overflow-hidden rounded-sm border border-gold/40 bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-[0_0_24px_-6px_hsl(var(--gold)/0.30),0_10px_30px_-12px_hsl(220_60%_0%/0.7)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
              )}
              {...props}
            >
              {content}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }
)

Tooltip.displayName = TooltipPrimitive.Content.displayName

export { Tooltip }
