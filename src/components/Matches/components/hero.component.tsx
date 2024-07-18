import { Tooltip } from "../../ui/tooltip";

type HeroNameType = {
  displayName: string
  shortName: string
}

export default function Hero({ displayName, shortName }: HeroNameType) {
  return (
    <Tooltip
      trigger={<img src={`https://cdn.stratz.com/images/dota2/heroes/${shortName}_horz.png`} alt="" className="w-24 rounded" />}
      content={<p>{displayName}</p>}
    />
  )
}
