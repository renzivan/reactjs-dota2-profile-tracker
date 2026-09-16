import { cn } from "../../lib/utils"
import { Tooltip } from "../ui/tooltip"

type HeroImageProps = {
  displayName?: string
  shortName?: string
  className?: string
}

/**
 * A hero's banner portrait, named on hover. Stratz serves the wide crop at
 * 256x144; the Steam CDN covers anything Stratz has not caught up with yet.
 */
export default function HeroImage({ displayName, shortName, className }: HeroImageProps) {
  return (
    <Tooltip
      trigger={
        <img
          src={`https://cdn.stratz.com/images/dota2/heroes/${shortName}_horz.png`}
          onError={(e) => {
            const img = e.currentTarget
            if (img.dataset.fallback) return
            img.dataset.fallback = "1"
            img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`
          }}
          alt=""
          className={cn("w-24 rounded", className)}
        />
      }
      content={<p>{displayName ?? "Unknown hero"}</p>}
    />
  )
}
