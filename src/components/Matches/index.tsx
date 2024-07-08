import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"

import { useGetMatches } from "../../services/player.service"
import { useGetHeroes } from "../../services/heroes.service"
import { useGetItems } from "../../services/items.service"

import { getHeroes } from "../../store/reducer/heroes"
import { getItems } from "../../store/reducer/items"

export default function Matches({ playerId }) {
  const heroes = useSelector(state => state.heroes.value)
  const items = useSelector(state => state.items.value)

  const dispatch = useDispatch()
  const { data: dataItems } = useGetItems()
  const { data: dataHeroes } = useGetHeroes()

  const {
    data: dataMatches,
    isLoading: isLoadingMatches,
    isError: isErrorMatches,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useGetMatches(playerId)

  useEffect(() => {
    if (dataHeroes && heroes.length === 0) {
      dispatch(getHeroes(Object.values(dataHeroes)))
    }
    if (dataItems && items.length === 0) {
      dispatch(getItems(Object.values(dataItems)))
    }
  }, [dataHeroes, dispatch, heroes, dataItems, items])

  console.log('matches: ', dataMatches)

  return (
    <div>
      {
        dataMatches?.pages.map(page => {
          return page.map(match => {
            const playerStats = match.players[0]
            const hero = heroes.find(it => it.id === playerStats.heroId)
            const matchItems = Array.from({ length: 6 }, (_, i) =>
              items.find(it => it.id === playerStats[`item${i}Id`])
            )
  
            return hero && (
              <div key={match.id} className="flex justify-center">
                <img
                  src={`https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_horz.png`}
                  alt=""
                  title={hero.displayName}
                  width={50}
                />
                <div>{playerStats.numKills}/{playerStats.numDeaths}/{playerStats.numAssists}</div>
                <div className={`bg-${playerStats.isVictory ? "green" : "red"}-300`}>{playerStats.isVictory ? "WIN" : "LOSE"}</div>
                <div>{playerStats.level}</div>
                {matchItems?.map((item, index) => (
                  <img
                    key={index}
                    src={`https://cdn.stratz.com/images/dota2/items/${item?.shortName}.png`}
                    title={item?.displayName}
                    width={50}
                    alt=""
                  />
                ))}
              </div>
            )
          })
        })
      }
      {dataMatches && hasNextPage && <Button onClick={() => fetchNextPage()}>Load more</Button>}
      {isFetchingNextPage && <h1>Refetching matches....</h1>}
      {((!dataMatches || isErrorMatches) && !isLoadingMatches) && <h1>No matches found or profile is private.</h1>}
      {isLoadingMatches && <h1>Loading matches....</h1>}
    </div>
  )
}
