import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { formatTimestamp, getRankName, secToMS } from "../../lib/utils"

import { useGetAbilities } from "../../services/abilities.service"
import { useGetMatches } from "../../services/player.service"
// import { useGetGameModes } from "../../services/gameModes.service"
import { useGetHeroes } from "../../services/heroes.service"
import { useGetLobbies } from "../../services/lobbies.service"

import { setAbilities } from "../../store/reducer/abilities"
// import { setGameModes } from "../../store/reducer/gameModes"
import { setHeroes } from "../../store/reducer/heroes"
import { setLobbies } from "../../store/reducer/lobbies"

import RankTier from "../RankTier"
import { Separator } from "../ui/separator"
import LevelCircle from "../LevelCircle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import Talent from "../Talent"
import Spinner from "../Spinner"
import { Tooltip } from "../ui/tooltip"
import { RootState } from "../../store"
import Role from "./components/role.component"
import MatchHero from "./components/hero.component"
import Items from "./components/items.component"
import { HeroType, MatchType } from "../../lib/types"

interface MatchesProps {
  playerId?: string
}

export default function Matches({ playerId }: MatchesProps) {
  const elementRef = useRef(null)
  const abilities = useSelector((state: RootState) => state.abilities.value)
  // const gameModes = useSelector((state: RootState) => state.gameModes.value)
  const heroes = useSelector((state: RootState) => state.heroes.value)
  const lobbies = useSelector((state: RootState) => state.lobbies.value)

  const dispatch = useDispatch()
  const { data: dataAbilities } = useGetAbilities()
  const { data: dataHeroes } = useGetHeroes()
  const { data: dataLobbies } = useGetLobbies()
  // const { data: dataGameModes } = useGetGameModes()

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

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [elementRef, loadMore, dataMatches?.length, loading])

  useEffect(() => {
    if (dataAbilities && abilities.length === 0) {
      dispatch(setAbilities(Object.values(dataAbilities)))
    }
    // if (dataGameModes && gameModes.length === 0) {
    //   dispatch(setGameModes(Object.values(dataGameModes)))
    // }
    if (dataHeroes && heroes.length === 0) {
      dispatch(setHeroes(Object.values(dataHeroes)))
    }
    if (dataLobbies && lobbies.length === 0) {
      dispatch(setLobbies(Object.values(dataLobbies)))
    }
  }, [playerId, dataHeroes, dispatch, heroes, dataLobbies, lobbies, dataAbilities, abilities])

  return (
    <div className="flex flex-col items-center">
      <div className="container mb-3 flex items-center gap-3">
        <span className="font-display text-xs uppercase tracking-[0.3em] neon-text-cyan">// match.log</span>
        <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/60 to-transparent" />
      </div>
      <div className="flex flex-col container items-center w-full overflow-x-auto mb-5 gap-2">
        {
          dataMatches?.map((match: MatchType) => {
              const lobby = lobbies?.find((it) => it.id === match.lobbyType)
              const playerStats = match.players[0]
              const hero = heroes.find((it) => it.id === playerStats.heroId) as HeroType
              const side = playerStats.isRadiant ? 'radiant' : 'dire'
              const win = playerStats.isVictory

              return (
                <Accordion
                  key={match.id}
                  className={`w-full panel corner-cuts relative overflow-hidden border-l-4 ${win ? 'border-l-emerald-400/80 shadow-[inset_4px_0_18px_-8px_rgba(52,211,153,0.6)]' : 'border-l-neon-rose/80 shadow-[inset_4px_0_18px_-8px_hsl(var(--neon-rose)/0.6)]'}`}
                  type="single"
                  collapsible
                >
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="hover:no-underline px-4 py-1 cursor-pointer hover:bg-neon-purple/5 transition-colors">
                      <div className="flex items-center justify-between w-full py-2">
                        <div className="flex items-center justify-between pr-5 min-w-40">
                          <MatchHero displayName={hero?.displayName} shortName={hero?.shortName}/>
                          <Role lane={playerStats.lane} role={playerStats.role} />
                        </div>
                        <Separator orientation="vertical" className="h-12 bg-neon-purple/30" />

                        <div className="flex items-center justify-between w-full px-5">
                          <div className="flex items-center gap-5 min-w-48">
                            <LevelCircle level={playerStats.level} />
                            <div
                              className={`w-8 h-8 flex items-center justify-center font-display text-sm rounded-sm corner-cuts ${
                                win
                                  ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)] border border-emerald-400/60'
                                  : 'bg-neon-rose/20 text-neon-rose shadow-[0_0_12px_hsl(var(--neon-rose)/0.5)] border border-neon-rose/60'
                              }`}
                              style={{ ['--c' as string]: '4px' }}
                            >
                              {win ? "W" : "L"}
                            </div>
                            <div className="text-sm min-w-20 font-mono">
                              <span className="text-emerald-400">{playerStats.kills}</span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-neon-rose">{playerStats.deaths}</span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-neon-cyan">{playerStats.assists}</span>
                            </div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{lobby?.name}</div>
                          </div>
                          <div className="flex items-center justify-end gap-3 min-w-52">
                            <Tooltip
                              trigger={<RankTier rank={match.rank} width={11} />}
                              content={<p>{getRankName(match.bracket)}-tier Match</p>}
                            />
                            <Items matchItems={[playerStats.item0Id, playerStats.item1Id, playerStats.item2Id, playerStats.item3Id, playerStats.item4Id, playerStats.item5Id,]} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between min-w-72">
                          <Separator orientation="vertical" className="h-12 bg-neon-purple/30" />
                          <Tooltip
                            trigger={<img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 rounded-sm" alt="" />}
                            content={<p className="capitalize">{side}</p>}
                          />
                          <div className="bg-neon-purple/15 border border-neon-purple/40 text-xs text-neon-purple uppercase tracking-wider rounded-sm py-2 px-2 min-w-32 capitalize font-mono text-center">
                            {match.gameMode.toLowerCase().replace(/_/g, " ")}
                          </div>
                          <div className="flex flex-col items-end font-mono">
                            <div className="text-xs text-neon-cyan">{secToMS(match.durationSeconds)}</div>
                            <div className="text-xs text-muted-foreground">{formatTimestamp(match.endDateTime)}</div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <div className="flex gap-2 flex-wrap">
                        {(hero && abilities) && playerStats?.abilities?.map((ability, index) => {
                          const abilityFound = abilities?.find((it) => it.id === ability.abilityId )

                          if (!abilityFound) return null

                          return abilityFound.isTalent ?
                            <Tooltip
                              key={index}
                              trigger={<Talent key={index} abilityId={abilityFound.id} heroTalents={hero?.talents} />}
                              content={<p>{abilityFound.language.displayName}</p>}
                            />
                            :
                            <Tooltip
                              key={index}
                              trigger={<img src={`https://cdn.stratz.com/images/dota2/abilities/${abilityFound.name}.png`} className="w-8 h-8 min-w-8 min-h-8 rounded-sm ring-1 ring-neon-purple/40 hover:ring-neon-cyan transition" alt="" />}
                              content={<p>{abilityFound.language.displayName}</p>}
                            />
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
          })
        }
      </div>
      <div ref={elementRef} className="flex flex-col items-center justify-center gap-5 mb-10">
        {isPrivate && <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">// profile.private</span>}
        {isNothingMore && <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">// end.of.log</span>}
        {((!dataMatches) && !loading) && <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">// no.match.data</span>}
        {(loading) && <Spinner />}
        {(dataMatches && !isPrivate && !isNothingMore) && <Button onClick={() => loadMore()}>Load more</Button>}
      </div>
    </div>
  )
}
