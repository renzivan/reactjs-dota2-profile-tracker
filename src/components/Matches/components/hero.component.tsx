import { HeroNameType } from "../../../lib/types";
import { Tooltip } from "../../ui/tooltip";

export default function MatchHero({ displayName, shortName }: HeroNameType) {
  return (
    <Tooltip
      trigger={<img src={`https://cdn.stratz.com/images/dota2/heroes/${shortName}_horz.png`} alt="" className="w-24 rounded" />}
      content={<p>{displayName}</p>}
    />
  )
}
