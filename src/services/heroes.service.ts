import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetHeroes = () => {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const res = await http.get('/Hero')

      return res.data
    }
  })
}
