import { useMemo } from "react"
import { useParams } from "react-router-dom"
import type { InitiaTokenInfo } from "@initia/use-essentials"
import { useInitiaEssentials } from "@initia/use-essentials"
import PoolLogoUSDC from "../logos/USDC-INIT.png"
import PoolLogoETH from "../logos/ETH-INIT.png"
import PoolLogoMATIC from "../logos/MATIC-INIT.png"
import PoolLogoATOM from "../logos/ATOM-INIT.png"

export interface DetailedPoolInfo {
  displayName: string
  weight: { INIT: number; TOKEN: number }
  token: InitiaTokenInfo
  lpToken: InitiaTokenInfo
  color: string
  logo?: string
  released?: boolean
  lock?: boolean
}

const TOKEN_DENOM = {
  USDC: `uusdc`,
  wstETH: `move/e3a97600010bb368be99d6f4ed231aca4dbba9b6340edf3c48dfbfd0474e92e8`,
  MaticX: `move/76f75544f1867066b0c64cfa71d91463767fb117bfc01cadf7e2fb5cfa204ba7`,
  stATOM: `move/92af68b117c6aff7dcac7547c9c72cf7e0c2b9044fa20148b7839a289394be51`,
}

const LP_TOKEN_DENOM = {
  USDC: `move/dbf06c48af3984ec6d9ae8a9aa7dbb0bb1e784aa9b8c4a5681af660cf8558d7d`,
  wstETH: `move/8266545287889db3ded9096208c014d67c2ebf64968816d04b5d58344a8fb8bd`,
  MaticX: `move/c9c9cb27844944ed08a8441a2dec30a46366c6f8c0a9b8fed028fcdd8a6ea273`,
  stATOM: `move/b9d795966ffd06125f71307f73b8ca22c5af5026fae64d6110af610735e999df`,
}

type Pools = Map<string, DetailedPoolInfo>

export function usePools() {
  const { tokens } = useInitiaEssentials()
  const pools = useMemo<{ byName: Pools; byToken: Pools; byLpMetadata: Pools; byDenom: Pools }>(() => {
    if (!tokens.size)
      return { byName: new Map([]), byToken: new Map([]), byLpMetadata: new Map([]), byDenom: new Map([]) }

    const list = [
      {
        displayName: "USDC-INIT",
        weight: { INIT: 0.8, TOKEN: 0.2 },
        token: tokens.get(TOKEN_DENOM.USDC)!,
        lpToken: tokens.get(LP_TOKEN_DENOM.USDC)!,
        color: "#2773CA",
        logo: PoolLogoUSDC,
        released: true,
        lock: false,
      },
      {
        displayName: "wstETH-INIT",
        weight: { INIT: 0.5, TOKEN: 0.5 },
        token: tokens.get(TOKEN_DENOM.wstETH)!,
        lpToken: tokens.get(LP_TOKEN_DENOM.wstETH)!,
        color: "#3B8FCC",
        logo: PoolLogoETH,
        released: true,
      },
      {
        displayName: "stATOM-INIT",
        weight: { INIT: 0.5, TOKEN: 0.5 },
        token: tokens.get(TOKEN_DENOM.stATOM)!,
        lpToken: tokens.get(LP_TOKEN_DENOM.stATOM)!,
        color: "#DD006B",
        logo: PoolLogoATOM,
        released: true,
      },
      {
        displayName: "MaticX-INIT",
        weight: { INIT: 0.5, TOKEN: 0.5 },
        token: tokens.get(TOKEN_DENOM.MaticX)!,
        lpToken: tokens.get(LP_TOKEN_DENOM.MaticX)!,
        color: "#6816BA",
        logo: PoolLogoMATIC,
        released: false,
      },
    ]

    return {
      byName: new Map(list.map((pool) => [pool.displayName + (pool?.lock ? "/lock" : ""), pool])), // by lp token name
      byToken: new Map(list.map((pool) => [pool.token?.metadata, pool])), // by token metadata
      byLpMetadata: new Map(list.map((pool) => [pool.lpToken?.metadata, pool])), // by lp token metadata
      byDenom: new Map(list.map((pool) => [pool.lpToken?.denom, pool])), // by lp token denom
    }
  }, [tokens])

  return pools
}

export const usePool = () => {
  const { name } = useParams()
  const pools = usePools()
  const pool = Array.from(pools.byName.values()).find((pool) => pool.displayName === name)
  if (!pool) throw new Error("Pool not found")
  return pool
}
