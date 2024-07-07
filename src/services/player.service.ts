import { useQuery } from "@tanstack/react-query"
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
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const res = await http.get(`/Player/${playerId}/matches`)
      // const res = await http.get(`/Player/${playerId}/matches?take=5&skip=4`)

      return res.data
    }
  })
}
