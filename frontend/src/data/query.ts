import { useQuery } from "@tanstack/react-query"
import { bcs, lcd, useViewFunction } from "../../modules"
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from "./constants"
import { AccAddress } from "@initia/initia.js"


export function useGetUserChickens(address: string) {
  return useViewFunction<string>([
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    "get_user_chickens",
    [],
    [bcs.serialize("address", AccAddress.toHex(address))],
  ])
}

export function useGetTotalChickens() {
  return useViewFunction<string>([
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    "get_total_chickens",
    [],
    [],
  ])
}

export function useGetChickenPrice() {
  return useViewFunction<string>([
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    "get_chicken_price",
    [],
    [],
  ])
}