import { HeroNameType } from "../../../lib/types";
import { Tooltip } from "../../ui/tooltip";

export default function MatchHero({ displayName, shortName }: HeroNameType) {
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
          className="w-24 rounded"
        />
      }
      content={<p>{displayName}</p>}
    />
  )
}
