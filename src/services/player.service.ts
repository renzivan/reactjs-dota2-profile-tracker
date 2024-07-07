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
