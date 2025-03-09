import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRole(lane: string, role: string) {
  if (lane === 'MID_LANE') {
    return { displayName: 'Mid Lane', shortName: 'mid' }
  }

  if (lane === 'SAFE_LANE') {
    return role === 'CORE' ? { displayName: 'Safe Lane', shortName: 'safe_lane' } : { displayName: 'Hard Support', shortName: 'hard_support' }
  }

  return role !== 'CORE' ? { displayName: 'Soft Support', shortName: 'soft_support' } : { displayName: 'Off Lane', shortName: 'offlane' }
}

export function secToMS(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  // Pad single digit seconds with a leading zero
  const formattedMins = String(mins)
  const formattedSecs = String(secs).padStart(2, '0')

  return `${formattedMins}:${formattedSecs}`
}

export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getRankName (rank: number) {
  switch (rank) {
    case 1:
      return 'Herald'
    case 2:
      return 'Guardian'
    case 3:
      return 'Crusader'
    case 4:
      return 'Archon'
    case 5:
      return 'Legend'
    case 6:
      return 'Ancient'
    case 7:
      return 'Divine'
    case 8:
      return 'Immortal'
    default:
      return 'Unranked'
  }
}
