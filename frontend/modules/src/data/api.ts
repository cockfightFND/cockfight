import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { API_URL } from "../../../src/data/constants"

export function useAPI<T>(path: string, params?: any) {
  return useQuery({
    queryKey: [path, params],
    queryFn: async () => {
      const { data } = await axios.get<T>(path, { baseURL: API_URL, params })
      return data
    },
  })
}