export default function RankTier(props: { rank: number, leaderBoard: number }) {

  const getRankImage = () => {
    if (!props.rank) {
      return '/ranks/rank_icon_0.png'
    }

    if (props.leaderBoard > 10 && props.leaderBoard <= 100) {
      return '/ranks/rank_icon_8b.png'
    }

    if (props.leaderBoard <= 10) {
      return '/ranks/rank_icon_8c.png'
    }

    return `/ranks/rank_icon_${props.rank.toString()[0]}.png`
  }

  const getTierImage = () => {
    if (!props.rank) return null

    return `/ranks/rank_star_${props.rank.toString()[1]}.png`
  }

  return (
    <div className="relative mt-4">
      {props?.rank < 80 &&
        <div className="w-28 absolute">
          <img src={getTierImage()} alt="Tier" />
        </div>
      }
      <div className="w-28">
        <img src={getRankImage()} alt="Rank" className="object-cover"  />
      </div>
      {props?.leaderBoard &&
        <div className="font-bold text-amber-200 absolute bottom-2 left-0 right-0 flex justify-center">{props.leaderBoard}</div>
      }
    </div>
  )
}
