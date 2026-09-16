import { ItemType } from "../../lib/types"
import { cn } from "../../lib/utils"
import { Tooltip } from "../ui/tooltip"

type ItemIconProps = {
  /** Undefined for an empty slot, or one the catalog cannot name — neutrals. */
  item?: ItemType
  className?: string
}

/** Engraved stone, so an empty slot still holds its place in a row of six. */
const EMPTY_SLOT =
  "border border-gold/15 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--bronze)/0.18),transparent_60%),repeating-linear-gradient(45deg,hsl(var(--background))_0_3px,hsl(var(--card))_3px_6px)] shadow-[inset_0_0_0_1px_hsl(var(--bronze)/0.15)]"

/** One item, with the Steam CDN as a fallback for anything Stratz is missing. */
export default function ItemIcon({ item, className }: ItemIconProps) {
  const size = cn("rounded w-10 h-7 shrink-0", className)

  if (!item) return <div className={cn(size, EMPTY_SLOT)} />

  return (
    <Tooltip
      trigger={
        <img
          src={`https://cdn.stratz.com/images/dota2/items/${item.shortName}.png`}
          onError={(e) => {
            const img = e.currentTarget
            if (img.dataset.fallback) return
            img.dataset.fallback = "1"
            // Neither CDN has a picture per recipe, only the one scroll they share.
            const name = item.shortName.startsWith("recipe") ? "recipe" : item.shortName
            img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${name}.png`
          }}
          className={cn(size, "object-cover")}
          alt=""
        />
      }
      content={<p>{item.displayName}</p>}
    />
  )
}
