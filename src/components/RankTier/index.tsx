export default function RankTier(props: { rank: number }) {

  const getRankImage = () => {
    if (!props.rank) return '/ranks/rank_icon_0.png'

    return `/ranks/rank_icon_${props.rank.toString()[0]}.png`
  }

  const getTierImage = () => {
    if (!props.rank || props.rank >= 80) return null

    return `/ranks/rank_star_${props.rank.toString()[1]}.png`
  }

  return (
    <div>
      {props.rank  && <img src={getTierImage()} alt="Tier" />}
      <img src={getRankImage()} alt="Rank" />
    </div>
  )
}
