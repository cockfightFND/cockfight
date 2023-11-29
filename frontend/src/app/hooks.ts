import { useEffect } from "react"
import { atom, useSetRecoilState } from "recoil"

export const backgroundColorState = atom<string | null>({
  key: "backgroundColor",
  default: null,
})

export function useBackgroundColor(color: string) {
  const setBackgroundColor = useSetRecoilState(backgroundColorState)

  useEffect(() => {
    setBackgroundColor(color)
    return () => setBackgroundColor(null)
  }, [color, setBackgroundColor])
}

export const navigationBarHeightState = atom({
  key: "navigationBarHeight",
  default: 0,
})

export const fixedBottomHeightState = atom({
  key: "fixedBottomHeight",
  default: 0,
})

export const showNavigationBarState = atom({
  key: "showNavigationBar",
  default: true,
})

export function useHideNavigation() {
  const setnavigationBarState = useSetRecoilState(showNavigationBarState)

  useEffect(() => {
    setnavigationBarState(false)
    return () => setnavigationBarState(true)
  }, [setnavigationBarState])
}
