import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { formatTimestamp, getRole, secToMS } from "../../lib/utils"

import { useGetMatches } from "../../services/player.service"
import { useGetGameModes } from "../../services/gameModes.service"
import { useGetHeroes } from "../../services/heroes.service"
import { useGetItems } from "../../services/items.service"
import { useGetLobbies } from "../../services/lobbies.service"

import { setGameModes } from "../../store/reducer/gameModes"
import { setHeroes } from "../../store/reducer/heroes"
import { setItems } from "../../store/reducer/items"
import { setLobbies } from "../../store/reducer/lobbies"

import RankTier from "../RankTier"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Matches({ playerId }) {
  const gameModes = useSelector(state => state.gameModes.value)
  const heroes = useSelector(state => state.heroes.value)
  const items = useSelector(state => state.items.value)
  const lobbies = useSelector(state => state.lobbies.value)

  const dispatch = useDispatch()
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

  const getBracket = (bracket) => {
    switch (bracket) {
      case 1:
        return 'Herald-tier Match'
      case 2:
        return 'Guardian-tier Match'
      case 3:
        return 'Crusader-tier Match'
      case 4:
        return 'Archon-tier Match'
      case 5:
        return 'Legend-tier Match'
      case 6:
        return 'Ancient-tier Match'
      case 7:
        return 'Divine-tier Match'
      case 8:
        return 'Immortal-tier Match'
      default:
        return 'Rankless-tier Match'
    }
  }

  useEffect(() => {
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
  }, [playerId, dataHeroes, dispatch, heroes, dataItems, items, dataLobbies, lobbies, dataGameModes, gameModes])

  console.log('matches: ', dataMatches)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col container items-center w-full overflow-x-auto">
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
                <div key={match.id} className="flex items-center justify-between w-full border-b py-2">
                  <div className="flex items-center justify-between min-w-40">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <img
                            src={`https://cdn.stratz.com/images/dota2/heroes/${hero?.shortName}_horz.png`}
                            alt=""
                            className="w-24 rounded"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{hero?.displayName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <img src={`/roles/${roleShortName}.svg`} alt="" className="w-7"/>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{roleName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Separator orientation="vertical" className="h-12" />
                  </div>

                  <div className="flex items-center justify-between w-full px-5">
                    <div className="flex items-center gap-3 min-w-48">
                      <div className="border border-4 rounded-full w-8 h-8 text-sm flex items-center justify-center">
                        <Label className="text-md">{playerStats.level}</Label>
                      </div>
                      <div className={`text-black w-7 h-7 flex items-center justify-center font-extrabold rounded ${playerStats.isVictory ? "!bg-emerald-500" : "!bg-red-500"}`}>
                        {playerStats.isVictory ? "W" : "L"}
                      </div>
                      <Label className="text-md">{playerStats.numKills} / {playerStats.numDeaths} / {playerStats.numAssists}</Label>
                      <Label className="text-md">{lobby?.name}</Label>
                    </div>
                    <div className="flex items-center justify-end gap-3 min-w-52">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <RankTier rank={match.rank} width={11} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getBracket(match.bracket)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex flex-wrap max-w-32 items-center justify-center gap-1">
                        {matchItems?.map((item, index) => (
                          item ? (
                              <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <img
                                    src={`https://cdn.stratz.com/images/dota2/items/${item?.shortName}.png`}
                                    key={index}
                                    className="rounded w-10 h-7"
                                    alt=""
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item?.displayName}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (<div key={index} className="bg-accent rounded w-10 h-7"/>)
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between min-w-64">
                    <Separator orientation="vertical" className="h-12" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                        <img src={`https://cdn.stratz.com/images/dota2/${side}_square.png`} className="h-8 rounded" alt="" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize">{side}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Label className="bg-accent rounded px-5 py-2">{gameMode?.name}</Label>
                    <div className="flex flex-col items-end">
                      <Label>{secToMS(match.durationSeconds)}</Label>
                      <Label>{formatTimestamp(match.endDateTime)}</Label>
                    </div>
                  </div>
                </div>
              )
            })
          })
        }
      </div>
      {(dataMatches && !isErrorMatches && hasNextPage) && <Button onClick={() => fetchNextPage()}>Load more</Button>}
      {isFetchingNextPage && <h1>Loading more matches....</h1>}
      {((!dataMatches || isErrorMatches) && !isLoadingMatches) && <h1>No matches found or profile is private.</h1>}
      {isLoadingMatches && <h1>Loading matches....</h1>}
      {isRefetching && <h1>Loading matches....</h1>}
    </div>
  )
}
