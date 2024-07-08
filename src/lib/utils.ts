import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRole(lane: number, role: number) {
  if (lane === 2) {
    return 'mid'
  }

  if (lane === 1) {
    return role === 0 ? 'carry' : 'hard support'
  }

  return role === 1 ? 'soft support' : 'offlane'
}

export function secToMS(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  // Pad single digit seconds with a leading zero
  const formattedMins = String(mins)
  const formattedSecs = String(secs).padStart(2, '0')

  return `${formattedMins}:${formattedSecs}`
}
