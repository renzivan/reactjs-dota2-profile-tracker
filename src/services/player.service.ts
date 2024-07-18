import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { http } from "./config.service"
import { MatchType, PlayerType } from "../lib/types"

export const useGetPlayer = (playerId: string) => {
  return useQuery<PlayerType>({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const res = await http.get<PlayerType>(`/Player/${playerId}`)
      return res.data
    }
  })
}

export const useGetMatches = (playerId: string) => {
  return useInfiniteQuery<MatchType[]>({
    queryKey: ['matches', playerId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await http.get<MatchType[]>(`/Player/${playerId}/matches?take=10&skip=${pageParam}`)
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
