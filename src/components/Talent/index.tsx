import TalentTree from "./talent-tree.component"

type TalentProps = {
  abilityId: number,
  heroTalents: Array
}

export default function Talent({ abilityId, heroTalents }: TalentProps) {
  const talent = heroTalents.find(talent => talent.abilityId === abilityId)

  return talent && <TalentTree slot={talent.slot} className="w-8" />
}
