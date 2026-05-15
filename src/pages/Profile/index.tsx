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
    return `${navigationMenuTriggerStyle()} font-display uppercase tracking-[0.2em] text-xs ${
      isActive
        ? '!bg-gold/15 !text-gold border-b-2 border-gold'
        : 'border-b-2 border-transparent hover:!text-gold'
    }`
  }

  if (loading || !data) {
    return (
      <div className="container py-24 flex flex-col items-center gap-4">
        {loading && (
          <>
            <div className="font-display text-xs uppercase tracking-[0.3em] gold-text">
              Summoning Profile
            </div>
            <Spinner />
          </>
        )}
        {(!data && !loading) && (
          <div className="panel brackets p-6 text-center max-w-md">
            <div className="aegis-title gold-text-strong text-xl mb-1">Profile Hidden</div>
            <div className="text-sm text-muted-foreground">No profile found, or profile is private.</div>
          </div>
        )}
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

      <div className="container">
        <div className="panel brackets relative p-6 md:p-8 overflow-hidden">
          <div aria-hidden className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-bronze/15 blur-3xl pointer-events-none" />

          <div className="absolute top-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Player · {playerId}
          </div>

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row mt-6">
            <div className="flex flex-col text-center items-center gap-4 md:flex-row md:text-left">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl animate-ember" />
                <div className="relative rounded-full overflow-hidden w-28 h-28 min-w-28 min-h-28 ring-2 ring-gold ring-offset-2 ring-offset-background">
                  <Skeleton className={`w-full h-full rounded-full bg-secondary ${isLoadingProfileImg ? 'block' : 'hidden'}`} />
                  <img
                    src={data.steamAccount.avatar}
                    onLoad={() => setIsLoadingProfileImg(false)}
                    alt=""
                    className={`object-cover w-full h-full ${isLoadingProfileImg ? 'hidden' : 'block'}`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] uppercase tracking-[0.3em] gold-text">
                  Steam Account
                </span>
                <a
                  href={data.steamAccount.profileUri}
                  target="_blank"
                  className="aegis-title text-3xl md:text-4xl gold-text-strong hover:brightness-110 transition cursor-pointer"
                >
                  {data.steamAccount.name}
                </a>
                <span className="font-mono text-xs text-muted-foreground">ID: {playerId}</span>
              </div>
            </div>

            <Tooltip
              trigger={<RankTier rank={data.steamAccount.seasonRank} leaderBoard={data.steamAccount.seasonLeaderboardRank} />}
              content={<p>{getRankName(Math.floor(data.steamAccount.seasonRank / 10))} {data.steamAccount.seasonRank < 80 && data.steamAccount.seasonRank % 10}</p>}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Matches playerId={playerId} />
      </div>
    </>
  )
}
