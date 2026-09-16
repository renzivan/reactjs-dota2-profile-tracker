import {
  AbilityConstantType,
  HeroType,
  ItemType,
  MatchDamageTotalsType,
  MatchDetailPlayerType,
} from "../../lib/types"
import { cn } from "../../lib/utils"
import { formatClock, formatCompactNumber, formatEnumLabel } from "../../lib/match/format"
import { abilityBuild, averageSeries, itemTimeline, lastSeries, wardCounts } from "../../lib/match/scoreboard"
import AbilityIcon from "../AbilityIcon"
import ItemIcon from "../ItemIcon"

type PlayerDetailProps = {
  player: MatchDetailPlayerType
  hero?: HeroType
  abilities: AbilityConstantType[]
  items: ItemType[]
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2">
    <h4 className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</h4>
    {children}
  </section>
)

const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-display text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span className="font-mono text-xs">{children}</span>
  </div>
)

const DAMAGE_KINDS = [
  { key: "physicalDamage", label: "Physical", bar: "bg-gold/70" },
  { key: "magicalDamage", label: "Magical", bar: "bg-mana/70" },
  { key: "pureDamage", label: "Pure", bar: "bg-parchment/70" },
] as const

/** Physical, magical and pure as one bar, so the mix is readable at a glance. */
const DamageBar = ({ label, totals }: { label: string; totals: MatchDamageTotalsType | null }) => {
  const parts = DAMAGE_KINDS.map((kind) => ({ ...kind, value: totals?.[kind.key] ?? 0 }))
  const total = parts.reduce((sum, part) => sum + part.value, 0)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-mono text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{formatCompactNumber(total)}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-sm border border-gold/20 bg-background">
        {total > 0 &&
          parts.map((part) => (
            <div key={part.key} className={part.bar} style={{ width: `${(part.value / total) * 100}%` }} />
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
        {parts.map((part) => (
          <span key={part.key}>
            <span className={`inline-block h-2 w-2 translate-y-px rounded-sm ${part.bar} mr-1.5`} />
            {part.label} {formatCompactNumber(part.value)}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Everything about one player that does not fit a scoreboard column: how the
 * hero was skilled, what was bought and when, and where the damage went.
 * A match Stratz has not parsed yet has none of this, and says so.
 */
export default function PlayerDetail({ player, hero, abilities, items }: PlayerDetailProps) {
  const build = abilityBuild(player.abilities)
  const purchases = itemTimeline(player.stats?.itemPurchases)
  const wards = wardCounts(player.stats?.wards)
  const damage = player.stats?.heroDamageReport
  const apm = averageSeries(player.stats?.actionsPerMinute)
  const camps = lastSeries(player.stats?.campStack)
  const isUnparsed = !player.stats && build.length === 0

  return (
    <div className="flex flex-col gap-6 border-t border-gold/20 bg-background/40 px-4 py-5">
      {isUnparsed && (
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Stratz has not parsed this replay yet, so there is nothing deeper to show for this player.
        </p>
      )}

      {build.length > 0 && (
        <Block title="Skill build">
          <div className="flex flex-wrap gap-1.5">
            {build.map((pick) => (
              <div key={`${pick.abilityId}-${pick.order}`} className="flex w-8 flex-col items-center gap-1">
                <AbilityIcon
                  ability={abilities.find((it) => it.id === pick.abilityId)}
                  heroTalents={hero?.talents}
                />
                <span className="font-mono text-[9px] leading-none text-muted-foreground">{pick.order}</span>
              </div>
            ))}
          </div>
        </Block>
      )}

      {purchases.length > 0 && (
        <Block title={`Item build · ${purchases.length} purchases`}>
          <div className="flex flex-wrap gap-x-1.5 gap-y-2">
            {purchases.map((purchase, index) => (
              <div key={`${purchase.itemId}-${purchase.time}-${index}`} className="flex flex-col items-center gap-1">
                <ItemIcon item={items.find((it) => it.id === purchase.itemId)} className="h-6 w-9" />
                <span className="font-mono text-[9px] leading-none text-muted-foreground">
                  {formatClock(purchase.time)}
                </span>
              </div>
            ))}
          </div>
        </Block>
      )}

      <div className={cn("grid gap-6", damage && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]")}>
        {damage && (
          <Block title="Hero damage">
            <div className="flex flex-col gap-4">
              <DamageBar label="Dealt" totals={damage.dealtTotal} />
              <DamageBar label="Taken" totals={damage.receivedTotal} />
            </div>
          </Block>
        )}

        <Block title="Game">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            <Fact label="Position">{formatEnumLabel(player.position) || "Unknown"}</Fact>
            <Fact label="Lane">{formatEnumLabel(player.lane) || "Unknown"}</Fact>
            <Fact label="Role">{formatEnumLabel(player.role) || "Unknown"}</Fact>
            <Fact label="Gold spent">{formatCompactNumber(player.goldSpent)}</Fact>
            <Fact label="Gold left">{formatCompactNumber(player.gold)}</Fact>
            <Fact label="Wards">
              <span className="text-mana">{wards.observer}</span>
              <span className="text-muted-foreground"> obs / </span>
              <span className="text-gold">{wards.sentry}</span>
              <span className="text-muted-foreground"> sentry</span>
            </Fact>
            <Fact label="Camps stacked">{camps}</Fact>
            <Fact label="Actions / min">{apm || "—"}</Fact>
            <Fact label="Party">{player.partyId === null ? "Solo" : `#${player.partyId}`}</Fact>
            <Fact label="Pick">{player.isRandom ? "Random" : "Picked"}</Fact>
            <Fact label="Award">
              {player.award && player.award !== "NONE" ? (
                <span className="text-gold">{formatEnumLabel(player.award)}</span>
              ) : (
                "—"
              )}
            </Fact>
            {player.leaverStatus && player.leaverStatus !== "NONE" && (
              <Fact label="Leaver">
                <span className="text-dire">{formatEnumLabel(player.leaverStatus)}</span>
              </Fact>
            )}
          </div>
        </Block>
      </div>
    </div>
  )
}
