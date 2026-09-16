import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { formatTimestamp, getRankName } from "../../lib/utils"
import { formatClock, formatEnumLabel } from "../../lib/match/format"

import { useAbilitiesCatalog } from "../../services/abilities.service"
import { useGetMatches } from "../../services/player.service"
import { useHeroesCatalog } from "../../services/heroes.service"

import RankTier from "../RankTier"
import { Separator } from "../ui/separator"
import LevelCircle from "../LevelCircle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import Spinner from "../Spinner"
import { Tooltip } from "../ui/tooltip"
import Role from "./components/role.component"
import HeroImage from "../HeroImage"
import Items from "../Items"
import AbilityIcon from "../AbilityIcon"
import { HeroType, MatchType } from "../../lib/types"

interface MatchesProps {
  playerId?: string
}

export default function Matches({ playerId }: MatchesProps) {
  const elementRef = useRef(null)
  const abilities = useAbilitiesCatalog()
  const heroes = useHeroesCatalog()

  const {
    data: dataMatches,
    loading,
    loadMore,
    isNothingMore
  } = useGetMatches(playerId || '')

  const isPrivate = dataMatches?.length === 0 && !loading

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && 
          dataMatches?.length > 0 && 
          dataMatches?.length % 10 === 0 &&
          !loading) {
        loadMore()
      }
    }, { threshold: 0.0 })

    const sentinel = elementRef.current
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [loadMore, dataMatches?.length, loading])

  return (
    <div className="flex flex-col items-center">
      <div className="container mb-3 flex items-center gap-3">
        <h2 className="font-display text-xs uppercase tracking-[0.3em] gold-text">// Match History</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent" />
      </div>
      <div className="flex flex-col container items-stretch w-full overflow-x-auto mb-5 gap-2">
        {
          dataMatches?.map((match: MatchType) => {
              const playerStats = match.players[0]
              const hero = heroes.find((it) => it.id === playerStats.heroId) as HeroType
              const side = playerStats.isRadiant ? 'radiant' : 'dire'
              const win = playerStats.isVictory

              return (
                <Accordion
                  key={match.id}
                  className={`min-w-max panel relative ${win ? 'stripe-radiant' : 'stripe-dire'}`}
                  type="single"
                  collapsible
                >
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger
                      className="hover:no-underline px-4 py-1 cursor-pointer hover:bg-gold/5 transition-colors"
                      action={
                        <Link
                          to={`/match/${match.id}?from=${playerId ?? ''}`}
                          aria-label={`Open the details of match ${match.id}`}
                          className="group flex shrink-0 items-center gap-1.5 border-l border-gold/25 px-4 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      }
                    >
                      <div className="flex items-center justify-between w-full py-2">
                        <div className="flex items-center justify-between pr-5 min-w-40">
                          <HeroImage displayName={hero?.displayName} shortName={hero?.shortName}/>
                          <Role lane={playerStats.lane} role={playerStats.role} />
                        </div>
                        <Separator orientation="vertical" className="h-12 bg-gold/25" />

                        <div className="flex items-center justify-between w-full px-5">
                          <div className="flex items-center gap-5 min-w-48">
                            <LevelCircle level={playerStats.level} />
                            <div
                              className={`w-8 h-8 flex items-center justify-center font-display text-sm rounded-sm ${
                                win
                                  ? 'bg-radiant/15 text-radiant border border-radiant/60 shadow-[0_0_10px_hsl(var(--radiant)/0.4)]'
                                  : 'bg-dire/15 text-dire border border-dire/60 shadow-[0_0_10px_hsl(var(--dire)/0.4)]'
                              }`}
                            >
                              {win ? "W" : "L"}
                            </div>
                            <div className="text-sm min-w-20 font-mono">
                              <span className="text-radiant">{playerStats.kills}</span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-dire">{playerStats.deaths}</span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-mana">{playerStats.assists}</span>
                            </div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-display">{formatEnumLabel(match.lobbyType)}</div>
                          </div>
                          <div className="flex items-center justify-end gap-3 min-w-52">
                            <Tooltip
                              trigger={<RankTier rank={match.rank} className="w-11" />}
                              content={<p>{getRankName(match.bracket)}-tier Match</p>}
                            />
                            <Items matchItems={[playerStats.item0Id, playerStats.item1Id, playerStats.item2Id, playerStats.item3Id, playerStats.item4Id, playerStats.item5Id,]} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between min-w-72">
                          <Separator orientation="vertical" className="h-12 bg-gold/25" />
                          <Tooltip
                            trigger={<img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 rounded-sm" alt="" />}
                            content={<p className="capitalize">{side}</p>}
                          />
                          <div className="bg-gold/10 border border-gold/40 text-xs text-gold uppercase tracking-[0.18em] rounded-sm py-2 px-2 min-w-32 capitalize font-display text-center">
                            {match.gameMode.toLowerCase().replace(/_/g, " ")}
                          </div>
                          <div className="flex flex-col items-end font-mono">
                            <div className="text-xs text-gold">{formatClock(match.durationSeconds)}</div>
                            <div className="text-xs text-muted-foreground">{formatTimestamp(match.endDateTime)}</div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <div className="flex gap-2 flex-wrap">
                        {(hero && abilities.length > 0) && playerStats?.abilities?.map((ability, index) => (
                          <AbilityIcon
                            key={index}
                            ability={abilities.find((it) => it.id === ability.abilityId)}
                            heroTalents={hero?.talents}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
          })
        }
      </div>
      <div ref={elementRef} className="flex flex-col items-center justify-center gap-5 mb-10">
        {isPrivate && <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.2em]">Profile is private</span>}
        {isNothingMore && <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.2em]">End of history</span>}
        {((!dataMatches) && !loading) && <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.2em]">No matches found</span>}
        {(loading) && <Spinner />}
        {(dataMatches && !isPrivate && !isNothingMore) && <Button onClick={() => loadMore()}>Load more</Button>}
      </div>
    </div>
  )
}
