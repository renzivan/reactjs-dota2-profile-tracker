import { AbilityConstantType, TalentType } from "../../lib/types"
import { cn } from "../../lib/utils"
import Talent from "../Talent"
import { Tooltip } from "../ui/tooltip"

type AbilityIconProps = {
  ability?: AbilityConstantType
  /** The hero's talent tree, needed to place a talent pick on its branch. */
  heroTalents?: TalentType[]
  className?: string
}

/**
 * One ability from a build, named on hover or on a click that keeps the name
 * up. Talents are a position on the hero's tree rather than an icon, so they
 * render as the tree with that branch lit.
 */
export default function AbilityIcon({ ability, heroTalents, className }: AbilityIconProps) {
  if (!ability) return null

  if (ability.isTalent) {
    if (!heroTalents) return null

    return (
      <Tooltip
        pinnable
        triggerClassName={cn(
          "flex h-8 w-8 items-center justify-center rounded-sm bg-gold/5 ring-1 ring-gold/30 transition hover:ring-gold",
          className,
        )}
        trigger={<Talent abilityId={ability.id} heroTalents={heroTalents} />}
        content={<p>{ability.language.displayName}</p>}
      />
    )
  }

  return (
    <Tooltip
      pinnable
      triggerClassName="flex"
      trigger={
        <img
          src={`https://cdn.stratz.com/images/dota2/abilities/${ability.name}.png`}
          onError={(e) => {
            const img = e.currentTarget
            if (img.dataset.fallback) return
            img.dataset.fallback = "1"
            img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.name}.png`
          }}
          className={cn(
            "w-8 h-8 min-w-8 min-h-8 rounded-sm ring-1 ring-gold/30 hover:ring-gold transition",
            className,
          )}
          alt=""
        />
      }
      content={<p>{ability.language.displayName}</p>}
    />
  )
}
