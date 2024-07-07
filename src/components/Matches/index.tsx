import { useGetMatches } from "../../services/player.service"

export default function Matches({playerId}) {
  const { data, isLoading, isError } = useGetMatches(playerId)

  if (isLoading) return (<h1>Loading matches....</h1>)
  if (isError) return (<h1>Cant load matches....</h1>)
  if (!data) return (<h1>No matches found....</h1>)
  console.log('matches: ', data)

  return (
    <div>Matches</div>
  )
}
