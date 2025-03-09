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
      <div className="flex flex-col container items-center w-full overflow-x-auto mb-5">
        {
          dataMatches?.map((match: MatchType) => {
              const lobby = lobbies?.find((it) => it.id === match.lobbyType)
              // const gameMode = gameModes?.find((it) => it.id === match.gameMode)
              const playerStats = match.players[0]
              const hero = heroes.find((it) => it.id === playerStats.heroId) as HeroType
              const side = playerStats.isRadiant ? 'radiant' : 'dire'

              return (
                <Accordion key={match.id} className="w-full" type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full py-2 cursor-pointer">
                        <div className="flex items-center justify-between pr-5 min-w-40">
                          <MatchHero displayName={hero?.displayName} shortName={hero?.shortName}/>
                          <Role lane={playerStats.lane} role={playerStats.role} />
                        </div>
                        <Separator orientation="vertical" className="h-12" />

                        <div className="flex items-center justify-between w-full px-5">
                          <div className="flex items-center gap-5 min-w-48">
                            <LevelCircle level={playerStats.level} />
                            <div className={`text-black w-7 h-7 flex items-center justify-center font-extrabold rounded ${playerStats.isVictory ? "!bg-emerald-500" : "!bg-red-500"}`}>
                              {playerStats.isVictory ? "W" : "L"}
                            </div>
                            <div className="text-md min-w-20">{playerStats.kills} / {playerStats.deaths} / {playerStats.assists}</div>
                            <div className="text-md">{lobby?.name}</div>
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
                          <Separator orientation="vertical" className="h-12" />
                          <Tooltip 
                            trigger={<img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 rounded" alt="" />}
                            content={<p className="capitalize">{side}</p>}
                          />
                          <div className="bg-accent text-sm rounded py-2 min-w-32 capitalize">{match.gameMode.toLowerCase().replace(/_/g, " ")}</div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm">{secToMS(match.durationSeconds)}</div>
                            <div className="text-sm">{formatTimestamp(match.endDateTime)}</div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="">
                      <div className="flex gap-2">
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
                              trigger={<img src={`https://cdn.stratz.com/images/dota2/abilities/${abilityFound.name}.png`} className="w-8 h-8 min-w-8 min-h-8 rounded" alt="" />}
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
      <div ref={elementRef} className="flex flex-col items-center justify-center gap-5">
        {isPrivate && <span>This profile is private</span>}
        {isNothingMore && <span>No more matches found</span>}
        {((!dataMatches) && !loading) && <span>No matches found or profile is private.</span>}
        {(loading) && <Spinner />}
        {(dataMatches && !isPrivate && !isNothingMore) && <Button onClick={() => loadMore()}>Load more</Button>}
      </div>
    </div>
  )
}
