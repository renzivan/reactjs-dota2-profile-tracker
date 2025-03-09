import { Link, useLocation, useParams } from 'react-router-dom'
import RankTier from '../../components/RankTier'
import Spinner from '../../components/Spinner'
import { useGetPlayer } from '../../services/player.service'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "../../components/ui/navigation-menu"
import { Tooltip } from '../../components/ui/tooltip'
import { getRankName } from '../../lib/utils'
import Matches from '../../components/Matches'
import { useState } from 'react'
import { Skeleton } from '../../components/ui/skeleton'

export function Profile() {
  const [isLoadingProfileImg, setIsLoadingProfileImg] = useState(true)
  const location = useLocation()
  const { playerId } = useParams<{ playerId: string }>()
  const { data, loading } = useGetPlayer(Number(playerId) || 0)

  const getLinkClassName = (to: string) => {
    const isActive = location.pathname === to
    return `${navigationMenuTriggerStyle()} ${isActive ? '!bg-accent' : ''}`
  }

  if (loading || !data) {
    return (
      <div className="flex justify-center mt-16">
        {loading && <Spinner />}
        {(!data && !loading) && <span>No profile found or profile is private.</span>}
      </div>
    )
  }

  return (
    <>
      <div className="container py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to={`/profile/${playerId}`} className={getLinkClassName(`/profile/${playerId}`)}>
                Overview
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="gradient-bg py-3">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col text-center items-center gap-4 md:flex-row">
            <div className="rounded-full overflow-hidden border border-2 border-red-400 w-28 h-28 min-w-28 min-h-28">
              <Skeleton className={`w-full h-full rounded-full bg-background ${isLoadingProfileImg ? 'block' : 'hidden'}`} />
              <img
                src={data.steamAccount.avatar}
                onLoad={() => setIsLoadingProfileImg(false)}
                alt=""
                className={`object-cover w-full h-full ${isLoadingProfileImg ? 'hidden' : 'block'}`}
              />
            </div>
            <a href={data.steamAccount.profileUri} target="_blank" className="hover:underline text-3xl">
              <span className="font-bold">{data.steamAccount.name}</span>
            </a>
          </div>
          <Tooltip
            trigger={<RankTier rank={data.steamAccount.seasonRank} leaderBoard={data.steamAccount.seasonLeaderboardRank} />}
            content={<p>{getRankName(Math.floor(data.steamAccount.seasonRank / 10))} {data.steamAccount.seasonRank < 80 && data.steamAccount.seasonRank % 10}</p>}
          />
        </div>
      </div>
      <div className="mt-5">
        <Matches playerId={playerId} />
      </div>
    </>
  )
}
