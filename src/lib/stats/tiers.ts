import type { WinrateTier } from './aggregate'

/** One colour rule for every winrate on the page. */
export function tierClasses(tier: WinrateTier): { text: string; fill: string } {
  switch (tier) {
    case 'high':
      return { text: 'text-radiant', fill: 'bg-radiant shadow-[0_0_10px_hsl(var(--radiant)/0.5)]' }
    case 'mid':
      return { text: 'text-gold', fill: 'bg-gold shadow-[0_0_10px_hsl(var(--gold)/0.5)]' }
    case 'low':
      return { text: 'text-dire', fill: 'bg-dire shadow-[0_0_10px_hsl(var(--dire)/0.5)]' }
  }
}
