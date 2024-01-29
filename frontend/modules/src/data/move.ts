import type { MoveAPI } from "@initia/initia.js"
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { lcd } from "../shared"

export const useViewFunction = <T>(args: Parameters<MoveAPI["viewFunction"]>, options?: UseQueryOptions<T>) => {
  return useQuery<T>({
    queryKey: ["move.viewFunction", ...args] as QueryKey,
    queryFn: async () => await lcd.move.viewFunction<T>(...args),
    ...options,
  })
}
