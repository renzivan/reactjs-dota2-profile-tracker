import { useQuery } from "@tanstack/react-query"
import { http } from "./config.service"
import { HeroType } from "../lib/types"

export const useGetHeroes = () => {
  return useQuery({
    queryKey: ['heroes'],
    queryFn: async () => {
      const res = await http.get<HeroType[]>('/Hero')

      return res.data
    }
  })
}
