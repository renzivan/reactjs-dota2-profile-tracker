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
    return `${navigationMenuTriggerStyle()} font-display uppercase tracking-widest text-xs ${
      isActive
        ? '!bg-neon-purple/15 !text-neon-purple border-b-2 border-neon-purple'
        : 'border-b-2 border-transparent hover:!text-neon-cyan'
    }`
  }

  if (loading || !data) {
    return (
      <div className="container py-24 flex flex-col items-center gap-4">
        {loading && (
          <>
            <div className="font-display text-xs uppercase tracking-[0.3em] neon-text-cyan">
              CONNECTING TO STRATZ NODE
            </div>
            <Spinner />
          </>
        )}
        {(!data && !loading) && (
          <div className="panel corner-cuts p-6 text-center max-w-md">
            <div className="font-display neon-text-pink text-lg mb-1">SIGNAL LOST</div>
            <div className="text-sm text-muted-foreground font-mono">No profile found or profile is private.</div>
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
        <div className="panel corner-cuts relative scanlines p-6 md:p-8 overflow-hidden">
          <div aria-hidden className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-neon-pink/15 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-neon-purple/15 blur-3xl pointer-events-none" />

          <div className="absolute top-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-neon-cyan/80">
            PLAYER //  {playerId}
          </div>

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row mt-6">
            <div className="flex flex-col text-center items-center gap-4 md:flex-row md:text-left">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-neon-purple/40 blur-2xl animate-neon-pulse" />
                <div className="relative rounded-full overflow-hidden w-28 h-28 min-w-28 min-h-28 ring-2 ring-neon-purple ring-offset-2 ring-offset-background">
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
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-cyan/80">
                  Steam Account
                </span>
                <a
                  href={data.steamAccount.profileUri}
                  target="_blank"
                  className="font-display text-3xl md:text-4xl neon-text-purple hover:neon-text-pink transition-colors cursor-pointer"
                >
                  {data.steamAccount.name}
                </a>
                <span className="font-mono text-xs text-muted-foreground">ID: {playerId}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-cyan/80">
                Rank Tier
              </span>
              <Tooltip
                trigger={<RankTier rank={data.steamAccount.seasonRank} leaderBoard={data.steamAccount.seasonLeaderboardRank} />}
                content={<p>{getRankName(Math.floor(data.steamAccount.seasonRank / 10))} {data.steamAccount.seasonRank < 80 && data.steamAccount.seasonRank % 10}</p>}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Matches playerId={playerId} />
      </div>
    </>
  )
}
