import { atom } from "recoil"

export interface MyFilter {
  query: string
  isOpen: boolean
}

export const myFilterState = atom<MyFilter>({
  key: "myFilter",
  default: {
    query: "",
    isOpen: false,
  },
})
