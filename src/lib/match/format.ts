/**
 * Formatting for the match detail page. Every helper here is pure so the page
 * itself stays about layout.
 */

/** "ALL_PICK_RANKED" -> "All Pick Ranked". Enum values reach us SCREAMING. */
export function formatEnumLabel(value?: string | null) {
  if (!value) return ""

  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Game clock as m:ss. Times are relative to the horn, so the pre-game shopping
 * that happens before it is negative and keeps its sign: -89 -> "-1:29".
 */
export function formatClock(seconds: number) {
  const sign = seconds < 0 ? "-" : ""
  const total = Math.abs(Math.floor(seconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60

  return `${sign}${mins}:${String(secs).padStart(2, "0")}`
}

/** 30745 -> "30.7k". Kept to one decimal so columns stay the same width. */
export function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) return "—"
  if (Math.abs(value) < 1000) return String(Math.round(value))

  return `${(value / 1000).toFixed(1)}k`
}

/** "Sep 13, 2026 · 9:38 PM", from a Stratz unix timestamp in seconds. */
export function formatMatchDate(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const day = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return `${day} · ${time}`
}

/**
 * Buildings still standing. Valve packs tower and barracks state into a
 * bitmask, one bit per building, so the count is a popcount.
 */
export function countStandingBuildings(status: number | null | undefined) {
  let bits = 0
  let rest = status ?? 0

  while (rest > 0) {
    bits += rest & 1
    rest >>>= 1
  }

  return bits
}

/**
 * A player's role, in the words players use. The API calls the position 4 a
 * light support, which nobody says out loud.
 */
export function formatRoleLabel(role?: string | null) {
  if (role === "LIGHT_SUPPORT") return "Soft Support"

  return formatEnumLabel(role)
}

/** (Kills + Assists) / Deaths, with a deathless game reading as the raw total. */
export function kdaRatio(kills: number, deaths: number, assists: number) {
  if (deaths === 0) return kills + assists

  return (kills + assists) / deaths
}

/** One decimal, so a scoreboard column of these lines up. */
export function formatRatio(value: number) {
  return value.toFixed(1)
}
