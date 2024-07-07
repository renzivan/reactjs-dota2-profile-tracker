import { useDispatch, useSelector } from "react-redux"
import { useGetMatches } from "../../services/player.service"
import { getHeroes } from "../../store/reducer/heroes"
import { useGetHeroes } from "../../services/heroes.service"
import { useEffect } from "react"

export default function Matches({playerId}) {
  const heroes = useSelector(state => state.heroes.value)
  const dispatch = useDispatch()

  const {
    data: dataMatches,
    isLoading: isLoadingMatches,
    isError: isErrorMatches
  } = useGetMatches(playerId)

  const { data: dataHeroes } = useGetHeroes()

  useEffect(() => {
    if (dataHeroes && heroes.length === 0) {
      dispatch(getHeroes(Object.values(dataHeroes)))
    }
  }, [dataHeroes, dispatch, heroes])

  if (isLoadingMatches) return (<h1>Loading matches....</h1>)
  if (!dataMatches || isErrorMatches) return (<h1>No matches found or profile is private.</h1>)
  console.log('matches: ', dataMatches)

  return (
    <div>
      Matches
      {
        dataMatches &&
        dataMatches.map(match => {
          const heroId = match.players[0].heroId
          const hero = heroes.find(it => it.id === heroId)

          return heroes && (
            <div key={match.id}>
              {hero?.displayName}
              <img src={`https://cdn.stratz.com/images/dota2/heroes/${hero?.shortName}_horz.png`} alt="" />
            </div>
          )
        })
      }
    </div>
  )
}
