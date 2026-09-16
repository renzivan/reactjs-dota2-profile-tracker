import { cn } from "../../lib/utils"

type RankTierProps = {
  rank: number
  leaderBoard?: number
  /**
   * Width of the badge. It has to be a literal Tailwind class: a class name
   * built at runtime is invisible to Tailwind's scanner and would never make it
   * into the stylesheet.
   */
  className?: string
}

export default function RankTier({
  rank,
  leaderBoard,
  className = "w-28"
}: RankTierProps) {

  const getRankImage = () => {
    if (!rank) {
      return '/ranks/rank_icon_0.png'
    }

    if (leaderBoard && leaderBoard > 10 && leaderBoard <= 100) {
      return '/ranks/rank_icon_8b.png'
    }

    if (leaderBoard && leaderBoard <= 10) {
      return '/ranks/rank_icon_8c.png'
    }

    return `/ranks/rank_icon_${rank.toString()[0]}.png`
  }

  const getTierImage = () => {
    if (!rank) return ''

    return `/ranks/rank_star_${rank.toString()[1]}.png`
  }

  return (
    <div className="relative">
      {(rank < 80 && rank % 10 !== 0) &&
        <div className={cn("absolute", className)}>
          <img src={getTierImage()} alt="Tier" />
        </div>
      }
      <div className={className}>
        <img src={getRankImage()} alt="Rank" className="object-cover" />
      </div>
      {leaderBoard !== undefined &&
        <div className="font-bold text-amber-200 absolute bottom-2 left-0 right-0 flex justify-center">{leaderBoard}</div>
      }
    </div>
  )
}
