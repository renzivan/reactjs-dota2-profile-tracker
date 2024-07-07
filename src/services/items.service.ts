import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"

export const useGetItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await http.get('/Item')

      return res.data
    }
  })
}
