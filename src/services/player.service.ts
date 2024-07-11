/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

interface Player {
  id: number
  steamAccount: {
    avatar: string
    profileUri: string
    name: string
    seasonRank: number
    seasonLeaderboardRank: number
  },
}

type MatchPlayerType = {
  isRadiant: boolean,
  heroId: number,
  lane: number,
  role: number,
  items: string[],
  level: number,
  isVictory: boolean,
  numKills: number,
  numDeaths: number,
  numAssists: number
}

interface Match {
  id: number
  lobbyType: number
  gameMode: number
  players: MatchPlayerType[]
  rank: number
  bracket: number
  durationSeconds: number
  endDateTime: number
  abilities: {
    id: number,
    language: {
      displayName: string
      name: string
    }
  }
}

export const useGetPlayer = (playerId: string) => {
  return useQuery<Player>({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const res = await http.get(`/Player/${playerId}`)
      return res.data
    }
  })
}

export const useGetMatches = (playerId: string) => {
  return useInfiniteQuery<Match[]>({
    queryKey: ['matches', playerId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await http.get(`/Player/${playerId}/matches?take=10&skip=${pageParam}`)
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10
      }
      return undefined
    },
    initialPageParam: 0
  })
}
