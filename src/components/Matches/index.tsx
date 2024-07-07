import { useDispatch, useSelector } from "react-redux"
import { useGetMatches } from "../../services/player.service"
import { getHeroes } from "../../store/reducer/heroes"
import { useGetHeroes } from "../../services/heroes.service"
import { useEffect } from "react"
import { useGetItems } from "../../services/items.service"
import { getItems } from "../../store/reducer/items"

export default function Matches({ playerId }) {
  const heroes = useSelector(state => state.heroes.value)
  const items = useSelector(state => state.items.value)
  const dispatch = useDispatch()

  const {
    data: dataMatches,
    isLoading: isLoadingMatches,
    isError: isErrorMatches
  } = useGetMatches(playerId)

  const { data: dataItems } = useGetItems()
  const { data: dataHeroes } = useGetHeroes()

  useEffect(() => {
    if (dataHeroes && heroes.length === 0) {
      dispatch(getHeroes(Object.values(dataHeroes)))
    }
    if (dataItems && items.length === 0) {
      dispatch(getItems(Object.values(dataItems)))
    }
  }, [dataHeroes, dispatch, heroes, dataItems, items])

  if (isLoadingMatches) return (<h1>Loading matches....</h1>)
  if (!dataMatches || isErrorMatches) return (<h1>No matches found or profile is private.</h1>)
  console.log('matches: ', dataMatches)

  return (
    <div>
      Matches
      {
        dataMatches &&
        dataMatches.map(match => {
          const playerStats = match.players[0]
          const hero = heroes.find(it => it.id === playerStats.heroId)
          const matchItems = Array.from({ length: 6 }, (_, i) =>
            items.find(it => it.id === playerStats[`item${i}Id`])
          )

          console.log('playerStats: ', playerStats)

          return hero && (
            <div key={match.id}>
              <img
                src={`https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_horz.png`}
                alt=""
                title={hero.displayName}
                width={50}
              />
              <span>{playerStats.numKills}/{playerStats.numDeaths}/{playerStats.numAssists}</span>
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
      }
    </div>
  )
}
