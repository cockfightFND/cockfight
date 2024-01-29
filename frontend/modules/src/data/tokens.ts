import { useMemo } from "react"
import axios from "axios"
import BigNumber from "bignumber.js"
import { useQueries, useQuery } from "@tanstack/react-query"
import { createInitiaDexClient, denomToMetadata } from "@initia/query"
import type { InitiaTokenInfo } from "@initia/use-essentials"
import { useAllBalances, useInitiaEssentials } from "@initia/use-essentials"
import { lcd } from "../shared"
import { bcs } from "../utils"
import { usePools } from "./pools"
import type { DetailedPoolInfo } from "./pools"
import { useDelegations } from "./staking"

interface PoolInfoResponse {
  coin_a_amount: string
  coin_b_amount: string
  total_share: string
}

interface ConvertedPoolInfo {
  uinitPerLp: string
  counterpartPerLp: string
}

export interface PoolInfo extends Partial<InitiaTokenInfo>, Partial<DetailedPoolInfo>, Partial<ConvertedPoolInfo> {
  ratio: number
}

export const usePrice = (denom: string) => {
  const { chain } = useInitiaEssentials()
  const { data } = useQuery({
    queryKey: ["api", "price", denom],
    queryFn: async () => {
      const { data } = await axios.get<{ prices: { [denom: string]: number } }>(
        `/v1/prices/${encodeURIComponent(denom)}`,
        {
          baseURL: chain.api,
        }
      )
      const { prices } = data
      return prices[denom] ?? 0
    },
  })
  return data ?? 0
}

export const usePriceINIT = () => {
  return usePrice("uinit")
}

const getPoolInfo = async (lpMetadata: string) => {
  const poolInfo = await lcd.move.viewFunction<PoolInfoResponse>(
    "0x1",
    "dex",
    "get_pool_info",
    [],
    [bcs.serialize("object", lpMetadata)]
  )

  const { coin_a_amount, coin_b_amount, total_share } = poolInfo

  return {
    counterpartPerLp: BigNumber(coin_a_amount).div(total_share).toString(),
    uinitPerLp: BigNumber(coin_b_amount).div(total_share).toString(),
  }
}

export const useGetPoolsInfo = (assets: string[]) => {
  const { tokens, pairs, chain } = useInitiaEssentials()

  const pools = usePools()

  const poolResults = useQueries({
    queries: assets
      .filter((denom) => {
        const metadata = denomToMetadata(denom)
        return !!pairs.get(metadata)
      })
      .map((denom) => {
        return {
          queryKey: ["poolInfo", denom],
          queryFn: async () => {
            const token = tokens.get(denom)
            const metadata = token?.metadata
            const client = createInitiaDexClient(chain.rest)

            const pool = pools.byLpMetadata.get(metadata ?? "")

            if (!pool || !metadata) return [token?.denom, {}] as const

            const lpToken = pool?.lpToken

            const poolInfo = await getPoolInfo(lpToken.metadata)
            const counterByInit = await client.getSpotPrice(denomToMetadata("uinit"), lpToken.metadata)

            const counterPrice = BigNumber(counterByInit).toString()
            const counterPerInit = BigNumber(poolInfo.counterpartPerLp).div(counterPrice).toString()
            const lpPriceRatio = BigNumber(poolInfo.uinitPerLp).plus(counterPerInit).toString()

            return [denom, { ...poolInfo, ...pool, ratio: lpPriceRatio }] as const
          },
          enabled: !!denom,
        }
      }),
  })

  const poolsInfo = useMemo(() => {
    return new Map(poolResults.map(({ data }) => data)?.filter((data) => !!data) as [string, PoolInfo][])
  }, [poolResults])

  return { data: poolsInfo, state: poolResults }
}

export const usePoolsInfo = (address?: string) => {
  const { chain } = useInitiaEssentials()
  const { address: addr } = useWallet()
  const { data: allBalances } = useAllBalances(chain.rpc, address ?? addr)
  const { data: staking } = useDelegations(address)
  const tokenAssets = allBalances?.map(({ denom }) => denom) ?? []
  const balances = staking?.map((item) => item.balance.toData()).flat()
  const stakingAssets = balances?.map(({ denom }) => denom) ?? []

  const poolsInfo = useGetPoolsInfo([...tokenAssets, ...stakingAssets] ?? [])
  return poolsInfo
}

export const useTokensInfo = (denomList: string[]) => {
  const { tokens, chain } = useInitiaEssentials()

  const results = useQueries({
    queries: denomList.map((denom) => {
      return {
        queryKey: ["tokenInfo", denom],
        queryFn: async () => {
          const token = tokens.get(denom)
          const { data } = await axios.get<{ prices: { [denom: string]: number } }>(
            `/v1/prices/${encodeURIComponent(denom)}`,
            { baseURL: chain.api }
          )
          const { prices } = data
          const ratio = prices?.[denom] ?? 0
          return [denom, { ...token, ratio }] as const
        },
        enabled: !!denom,
      }
    }),
  })

  const tokensInfo = useMemo(() => {
    return new Map(results.map(({ data }) => data)?.filter((data): data is [string, PoolInfo] => !!data))
  }, [results])

  return { data: tokensInfo, state: results }
}
