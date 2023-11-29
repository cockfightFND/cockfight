import { atom } from "recoil"

export interface InventoryFilter {
  query: string
}

export const inventoryFilterState = atom<InventoryFilter>({
  key: "inventoryFilter",
  default: {
    query: "",
  },
})
