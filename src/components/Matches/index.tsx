import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { formatTimestamp, getRankName, getRole, secToMS } from "../../lib/utils"

import { useGetAbilities } from "../../services/abilities.service"
import { useGetMatches } from "../../services/player.service"
import { useGetGameModes } from "../../services/gameModes.service"
import { useGetHeroes } from "../../services/heroes.service"
import { useGetItems } from "../../services/items.service"
import { useGetLobbies } from "../../services/lobbies.service"

import { setAbilities } from "../../store/reducer/abilities"
import { setGameModes } from "../../store/reducer/gameModes"
import { setHeroes } from "../../store/reducer/heroes"
import { setItems } from "../../store/reducer/items"
import { setLobbies } from "../../store/reducer/lobbies"

import RankTier from "../RankTier"
import { Separator } from "../ui/separator"
import { Tooltip } from "@/components/ui/tooltip"
import LevelCircle from "../LevelCircle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Talent from "../Talent"
import Spinner from "../Spinner"

export default function Matches({ playerId }) {
  const elementRef = useRef(null)

  const abilities = useSelector(state => state.abilities.value)
  const gameModes = useSelector(state => state.gameModes.value)
  const heroes = useSelector(state => state.heroes.value)
  const items = useSelector(state => state.items.value)
  const lobbies = useSelector(state => state.lobbies.value)

  const dispatch = useDispatch()
  const { data: dataAbilities } = useGetAbilities()
  const { data: dataItems } = useGetItems()
  const { data: dataHeroes } = useGetHeroes()
  const { data: dataLobbies } = useGetLobbies()
  const { data: dataGameModes } = useGetGameModes()

  const {
    data: dataMatches,
    isLoading: isLoadingMatches,
    isError: isErrorMatches,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    hasNextPage
  } = useGetMatches(playerId)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    }, { threshold: 0.0 }) // 10% of the element is visible

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [elementRef, fetchNextPage, hasNextPage])

  useEffect(() => {
    if (dataAbilities && abilities.length === 0) {
      dispatch(setAbilities(Object.values(dataAbilities)))
    }
    if (dataGameModes && gameModes.length === 0) {
      dispatch(setGameModes(Object.values(dataGameModes)))
    }
    if (dataHeroes && heroes.length === 0) {
      dispatch(setHeroes(Object.values(dataHeroes)))
    }
    if (dataItems && items.length === 0) {
      dispatch(setItems(Object.values(dataItems)))
    }
    if (dataLobbies && lobbies.length === 0) {
      dispatch(setLobbies(Object.values(dataLobbies)))
    }
  }, [playerId, dataHeroes, dispatch, heroes, dataItems, items, dataLobbies, lobbies, dataGameModes, gameModes, dataAbilities, abilities])
  console.log('dataMatches: ', dataMatches)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col container items-center w-full overflow-x-auto mb-5">
        {
          dataMatches?.pages?.map(page => {
            return page.map(match => {
              const lobby = lobbies?.find(it => it.id === match.lobbyType)
              const gameMode = gameModes?.find(it => it.id === match.gameMode)
              const playerStats = match.players[0]
              const hero = heroes.find(it => it.id === playerStats.heroId)
              const side = playerStats.isRadiant ? 'radiant' : 'dire'
              const { displayName: roleName, shortName: roleShortName } = getRole(playerStats.lane, playerStats.role)
              const matchItems = Array.from({ length: 6 }, (_, i) =>
                items.find(it => it.id === playerStats[`item${i}Id`])
              )

              return (
                <Accordion key={match.id} className="w-full" type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full py-2 cursor-pointer">
                        <div className="flex items-center justify-between min-w-40">
                          <Tooltip 
                            trigger={<img src={`https://cdn.stratz.com/images/dota2/heroes/${hero?.shortName}_horz.png`} alt="" className="w-24 rounded" />}
                            content={<p>{hero?.displayName}</p>}
                          />
                          <Tooltip 
                            trigger={<img src={`/roles/${roleShortName}.svg`} alt="" className="w-7"/>}
                            content={<p>{roleName}</p>}
                          />
                          <Separator orientation="vertical" className="h-12" />
                        </div>

                        <div className="flex items-center justify-between w-full px-5">
                          <div className="flex items-center gap-5 min-w-48">
                            <LevelCircle level={playerStats.level} />
                            <div className={`text-black w-7 h-7 flex items-center justify-center font-extrabold rounded ${playerStats.isVictory ? "!bg-emerald-500" : "!bg-red-500"}`}>
                              {playerStats.isVictory ? "W" : "L"}
                            </div>
                            <div className="text-md min-w-20">{playerStats.numKills} / {playerStats.numDeaths} / {playerStats.numAssists}</div>
                            <div className="text-md">{lobby?.name}</div>
                          </div>
                          <div className="flex items-center justify-end gap-3 min-w-52">
                            <Tooltip 
                              trigger={<RankTier rank={match.rank} width={11} />}
                              content={<p>{getRankName(match.bracket)}-tier Match</p>}
                            />
                            <div className="flex flex-wrap max-w-32 items-center justify-center gap-1">
                              {matchItems?.map((item, index) => (
                                item ? (      
                                  <Tooltip
                                    key={index}
                                    trigger={<img src={`https://cdn.stratz.com/images/dota2/items/${item?.shortName}.png`} className="rounded w-10 h-7" alt="" />}
                                    content={<p>{item?.displayName}</p>}
                                  />
                                ) : (<div key={index} className="bg-accent rounded w-10 h-7"/>)
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between min-w-72">
                          <Separator orientation="vertical" className="h-12" />
                          <Tooltip 
                            trigger={<img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 rounded" alt="" />}
                            content={<p className="capitalize">{side}</p>}
                          />
                          <div className="bg-accent text-sm rounded py-2 min-w-32">{gameMode?.name}</div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm">{secToMS(match.durationSeconds)}</div>
                            <div className="text-sm">{formatTimestamp(match.endDateTime)}</div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex gap-2">
                        {(hero && abilities) && playerStats?.abilities?.map((ability, index) => {
                          const abilityFound = abilities?.find(it => it.id === ability.abilityId )

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
                              trigger={<img src={`https://cdn.stratz.com/images/dota2/abilities/${abilityFound.name}.png`} className="w-8 h-8 rounded" alt="" />}
                              content={<p>{abilityFound.language.displayName}</p>}
                            />
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })
          })
        }
      </div>
      <div ref={elementRef} className="flex flex-col items-center justify-center gap-5">
        {((!dataMatches || isErrorMatches) && !isLoadingMatches) && <span>No matches found or profile is private.</span>}
        {(isLoadingMatches || isRefetching || isFetchingNextPage) && <Spinner />}
        {(dataMatches && !isErrorMatches && hasNextPage) && <Button onClick={() => fetchNextPage()}>Load more</Button>}
      </div>
    </div>
  )
}
