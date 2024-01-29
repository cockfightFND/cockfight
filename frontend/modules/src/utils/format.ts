import BigNumber from "bignumber.js"
import { format } from "date-fns"
import type { Coin, Coins } from "@initia/initia.js"
import { formatAmount } from "@initia/utils"
import type { InitiaTokenInfo } from "@initia/use-essentials"

export const getAmount = (coins: Coins, denom: string, fallback = "0") => {
  return coins.get(denom)?.amount.toString() ?? fallback
}

export const formatDenom = (denom: string, whitelist: Map<string, InitiaTokenInfo> = new Map([])) => {
  const token = whitelist.get(denom)
  if (token) return token.symbol ?? denom
  if (denom?.startsWith("move/")) return [...whitelist.values()].find((token) => token.denom === denom)?.symbol ?? denom
  if (!denom?.startsWith("u")) return denom
  return denom.slice(1).toUpperCase()
}

export const formatCoin = (coin: Coin.Data | Coins.Data, whitelist: Map<string, InitiaTokenInfo> = new Map([])) => {
  if (!coin) return
  if (Array.isArray(coin)) {
    const coins = coin as { amount: string; denom: string }[]
    return coins.map(({ amount, denom }) => [formatAmount(amount), formatDenom(denom, whitelist)].join(" ")).join(", ")
  } else {
    const { denom, amount } = coin as { amount: string; denom: string }
    return [formatAmount(amount), formatDenom(denom, whitelist)].join(" ")
  }
}

export const formatDate = (date: Date, config?: { short: boolean }) => {
  return config?.short ? format(date, "MMM d HH:mm") : format(date, "MMM d, y HH:mm:ss")
}

export const hasValue = (value?: BigNumber.Value) => !!value && new BigNumber(value).gte(1)

export const inputNumber = (value: string) => value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
