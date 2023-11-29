import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { Paginated } from "@initia/marketplace-api-types"
import { API_URL } from "./constants"

export function useAPI<T>(path: string, params?: any) {
  return useQuery({
    queryKey: [path, params],
    queryFn: async () => {
      const { data } = await axios.get<T>(path, { baseURL: API_URL, params })
      return data
    },
  })
}

export function usePaginatedAPI<T>(path: string, params?: any) {
  return useInfiniteQuery({
    queryKey: [path, params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<Paginated<T>>(path, {
        baseURL: API_URL,
        params: { ...params, page: pageParam },
      })
      return data
    },
    getNextPageParam: ({ metaData: { page, lastPage } }) => {
      const nextPage = page + 1
      if (nextPage > lastPage) return undefined
      return nextPage
    },
  })
}
