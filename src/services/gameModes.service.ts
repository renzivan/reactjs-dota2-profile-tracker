import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetGameModes = () => {
  return useQuery({
    queryKey: ['gameModes'],
    queryFn: async () => {
      const res = await http.get('/gameMode')

      return res.data
    }
  })
}
