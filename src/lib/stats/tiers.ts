import type { WinrateTier } from './aggregate'

/**
 * One colour rule for every winrate on the page. `fill` carries no glow: the
 * bar track clips to its own 8px box, so a box-shadow there is never painted.
 */
export function tierClasses(tier: WinrateTier): { text: string; fill: string } {
  switch (tier) {
    case 'high':
      return { text: 'text-radiant', fill: 'bg-radiant' }
    case 'mid':
      return { text: 'text-gold', fill: 'bg-gold' }
    case 'low':
      return { text: 'text-dire', fill: 'bg-dire' }
  }
}
