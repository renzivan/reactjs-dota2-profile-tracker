import { cva } from "class-variance-authority"

// Kept apart from navigation-menu.tsx so that file only exports components,
// which is what React Fast Refresh needs to hot-reload it reliably.
export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gold/15 data-[active]:text-gold data-[state=open]:bg-gold/15"
)
