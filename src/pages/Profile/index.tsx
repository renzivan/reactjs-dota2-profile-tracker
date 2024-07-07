import Matches from '../../components/Matches'
import RankTier from '../../components/RankTier'
import { useGetPlayer } from '../../services/player.service'
import { useParams } from 'react-router-dom'

export function Profile() {
  const { playerId } = useParams()
  const { data, isLoading, isError } = useGetPlayer(playerId)

  if (isLoading) return (<h1>Loading profile....</h1>)
  if (isError) return (<h1>Cant load profile....</h1>)
  if (!data) return (<h1>No player found....</h1>)
  console.log('player: ', data)

  return (
    <>
      <div>Profile</div>
      <div>{data.steamAccount.id}</div>
      <div>{data.steamAccount.profileUri}</div>
      <div>{data.steamAccount.name}</div>
      <img src={data.steamAccount.avatar} alt="" />
      <RankTier rank={data.steamAccount.seasonRank} />
      <Matches playerId={playerId} />
    </>
  )
}
