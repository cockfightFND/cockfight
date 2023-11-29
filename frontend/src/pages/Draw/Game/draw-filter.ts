import { atom } from "recoil"
import { DrawSort } from "@initia/marketplace-api-types"

export interface DrawFilter {
  query: string
  sort: string
  probability: { min?: number; max?: number }
  price: { min?: string; max?: string }
}

export const drawFilterState = atom<DrawFilter>({
  key: "drawFilter",
  default: {
    query: "",
    sort: DrawSort.MostPopular,
    probability: { min: undefined, max: undefined },
    price: { min: undefined, max: undefined },
  },
})
