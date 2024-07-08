import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetPlayer = (playerId: string) => {
  return useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const res = await http.get(`/Player/${playerId}`)

      return res.data
    }
  })
}

export const useGetMatches = (playerId: string) => {
  return useInfiniteQuery({
    queryKey: ['matches'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await http.get(`/Player/${playerId}/matches?take=5&skip=${pageParam}`)
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 5) {
        return allPages.length * 5
      }

      return undefined
    }
  })
}
