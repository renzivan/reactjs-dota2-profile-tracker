import Matches from '@/components/Matches'
import RankTier from '@/components/RankTier'
import { useGetPlayer } from '../../services/player.service'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "../../components/ui/navigation-menu"

export function Profile() {
  const location = useLocation()
  const { playerId } = useParams()
  const { data, isLoading, isError } = useGetPlayer(playerId)

  const getLinkClassName = (to) => {
    const isActive = location.pathname === to
    return `${navigationMenuTriggerStyle()} ${isActive ? '!bg-accent' : ''}`
  }

  if (isLoading) return (<h1>Loading profile....</h1>)
  if (isError) return (<h1>Cant load profile....</h1>)
  if (!data) return (<h1>No player found....</h1>)

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
            {/* <NavigationMenuItem>
              <Link to={`/profile/${playerId}/matches`} className={getLinkClassName(`/profile/${playerId}/matches`)}>
                Matches
              </Link>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="gradient-bg py-3">
        <div className="container flex justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full overflow-hidden border border-2 border-red-400 w-28 h-28">
              <img src={data.steamAccount.avatar} alt="" className="object-cover" />
            </div>
            <a href={data.steamAccount.profileUri} target="_blank" className="hover:underline text-3xl">
              <span className="font-bold">{data.steamAccount.name}</span>
            </a>
          </div>
          <RankTier rank={data.steamAccount.seasonRank} leaderBoard={data.steamAccount.seasonLeaderboardRank} />
        </div>
      </div>
      <div className="mt-5">
        <Matches playerId={playerId} />
      </div>
    </>
  )
}
