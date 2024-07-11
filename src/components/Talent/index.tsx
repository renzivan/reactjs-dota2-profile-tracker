/* eslint-disable @typescript-eslint/no-explicit-any */
import TalentTree from "./talent-tree.component"

type Talent = {
  abilityId: number,
  slot: number
}

type TalentProps = {
  abilityId: number,
  heroTalents: Talent[]
}

export default function Talent({ abilityId, heroTalents }: TalentProps) {
  const talent = heroTalents.find((talent: any) => talent.abilityId === abilityId)

  return talent && <TalentTree slot={talent?.slot} className="w-8" />
}
