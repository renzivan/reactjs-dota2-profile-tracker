import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetAbilities = () => {
  return useQuery({
    queryKey: ['abilities'],
    queryFn: async () => {
      const res = await http.get('/ability')

      return res.data
    }
  })
}
