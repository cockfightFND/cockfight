import { atom } from "recoil"
import type { TraitFilter } from "@initia/marketplace-api-types"
import { TokenStatus } from "@initia/marketplace-api-types"

export interface MarketFilter {
  query: string
  status: string
  price: { min?: string; max?: string }
  traits: TraitFilter
}

export const defaultValue = {
  query: "",
  status: TokenStatus.Open,
  price: { min: undefined, max: undefined },
  traits: { stringTraits: [] },
}

export const marketFilterState = atom<MarketFilter>({
  key: "marketFilter",
  default: defaultValue,
})
