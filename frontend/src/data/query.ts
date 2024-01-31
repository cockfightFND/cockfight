import { bcs, useViewFunction } from "../../modules"
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from "./constants"
import { AccAddress } from "@initia/initia.js"

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