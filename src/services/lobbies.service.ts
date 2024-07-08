import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetLobbies = () => {
  return useQuery({
    queryKey: ['lobbies'],
    queryFn: async () => {
      const res = await http.get('/lobbyType')

      return res.data
    }
  })
}
