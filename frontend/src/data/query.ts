import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME, REST_URL } from "./constants"
import { AccAddress, BCS, LCDClient } from "@initia/initia.js"
import type { MoveAPI } from "@initia/initia.js"
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

export const bcs = BCS.getInstance();
const lcd = new LCDClient(REST_URL)
export const useViewFunction = <T>(args: Parameters<MoveAPI["viewFunction"]>, options?: UseQueryOptions<T>) => {
  return useQuery<T>({
    queryKey: ["move.viewFunction", ...args] as QueryKey,
    queryFn: async () => await lcd.move.viewFunction<T>(...args),
    ...options,
  })
}

export interface ModuleResponse {
  total_chickens: string
  chicken_price: string
  egg_price: string
  chickens: string
  eggs: string
  cock_fights: string
}

export function useGetModuleStore() {
  return useViewFunction<ModuleResponse>([
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    "get_module_store",
    [],
    [],
  ])
}

export function useGetUserChickens(address: string) {
  return useViewFunction<string>([
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    "get_user_chickens",
    [],
    [bcs.serialize("address", AccAddress.toHex(address))],
  ])
}