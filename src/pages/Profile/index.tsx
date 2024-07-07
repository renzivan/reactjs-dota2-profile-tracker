import RankTier from '../../components/RankTier';
import { useGetPlayer } from '../../services/player.service'
import { useParams } from 'react-router-dom';

export function Profile() {
  const { playerId } = useParams()
  const { data, isLoading, isError } = useGetPlayer(playerId)

  if (isLoading) return (<h1>Loading....</h1>)
  if (isError) return (<h1>Erroring....</h1>)
  if (!data) return (<h1>No player found....</h1>)
    console.log('data: ', data)
  return (
    <>
      <div>Profile</div>
      <div>{data.steamAccount.id}</div>
      <div>{data.steamAccount.profileUri}</div>
      <div>{data.steamAccount.name}</div>
      <RankTier rank={data.steamAccount.seasonRank} />
      <img src={data.steamAccount.avatar} alt="" />
    </>
  )
}
