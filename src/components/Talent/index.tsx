import { TalentType } from "../../lib/types"
import TalentTree from "./talent-tree.component"

interface TalentProps {
  abilityId: number,
  heroTalents: TalentType[]
}

export default function Talent({ abilityId, heroTalents }: TalentProps) {
  const talent = heroTalents.find((talent) => talent.abilityId === abilityId)

  return talent ? <TalentTree slot={talent.slot} className="w-8" /> : null
}
