import { matchPath, useLocation } from "react-router-dom"

export function useIsDrawMenu() {
  const { pathname } = useLocation()
  return matchPath("/draw/*", pathname) || matchPath("/inventory/create/draw/result", pathname)
}
