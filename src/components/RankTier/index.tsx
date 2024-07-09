type RankTierProps = {
  rank: number
  leaderBoard: number
  width?: number
}

export default function RankTier({
  rank,
  leaderBoard,
  width = 28
}: RankTierProps) {

  const getRankImage = () => {
    if (!rank) {
      return '/ranks/rank_icon_0.png'
    }

    if (leaderBoard > 10 && leaderBoard <= 100) {
      return '/ranks/rank_icon_8b.png'
    }

    if (leaderBoard <= 10) {
      return '/ranks/rank_icon_8c.png'
    }

    return `/ranks/rank_icon_${rank.toString()[0]}.png`
  }

  const getTierImage = () => {
    if (!rank) return null

    return `/ranks/rank_star_${rank.toString()[1]}.png`
  }

  return (
    <div className="relative">
      {(rank < 80 && rank % 10 !== 0) &&
        <div className={`w-${width} absolute`}>
          <img src={getTierImage()} alt="Tier" />
        </div>
      }
      <div className={`w-${width}`}>
        <img src={getRankImage()} alt="Rank" className="object-cover"  />
      </div>
      {leaderBoard &&
        <div className="font-bold text-amber-200 absolute bottom-2 left-0 right-0 flex justify-center">{leaderBoard}</div>
      }
    </div>
  )
}
