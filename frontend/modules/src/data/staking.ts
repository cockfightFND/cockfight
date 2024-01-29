import { useMemo } from "react"
import { reduceBy, reduce, values } from "ramda"
import type { Delegation, Validator, Rewards, Coins } from "@initia/initia.js"
import { BigNumber } from "@initia/initia.js"
import { useQuery } from "@tanstack/react-query"
import { useAddress } from "../shared"
import { lcd, DAY_IN_SECONDS } from "../shared"
import { useAPI } from "../data/api"

interface AmountItem {
  denom: string
  validator_address: string
  amount: string
  isDecimal: boolean
}

interface RewardItem {
  denom: string
  validator_address: string
  reward: string
  coins: Coins
}

export interface StakeInfos extends AmountItem, RewardItem {}

export interface StakingPool<T> extends StakeInfos {
  validators: T[]
  subRows?: T[]
  rowType?: string
}

export interface ValidatorInfo {
  validator: string
  image: string
  total_blocks: number
  signed_blocks: number
  gov_participation: {
    proposal_id: string
    proposal_title: string
    vote: number
    status: number
  }[]
}

export const useValidator = (address: string) => {
  return useQuery({
    queryKey: ["staking.validator", address],
    queryFn: async () => await lcd.mstaking.validator(address),
  })
}

export const useStakingParams = () => {
  return useQuery({
    queryKey: ["staking.parameters"],
    queryFn: async () => await lcd.mstaking.parameters(),
  })
}

export const useUnbondingDays = () => {
  const { data: stakingParams } = useStakingParams()
  const { unbonding_time } = stakingParams ?? { unbonding_time: "0" }
  const unbondingTime = unbonding_time.toString().replace("s", "")
  return Number(unbondingTime) / DAY_IN_SECONDS
}

export const useDelegations = (addr?: string) => {
  const address = useAddress()

  return useQuery({
    queryKey: ["staking.delegations", addr ?? address],
    queryFn: async () => {
      if (!address) return []
      const [delegations] = await lcd.mstaking.delegations(addr ?? address)
      return delegations
    },
  })
}

export const useUndelegations = () => {
  const address = useAddress()

  return useQuery({
    queryKey: ["staking.unbondingDelegations", address],
    queryFn: async () => {
      if (!address) return []
      const [undelegations] = await lcd.mstaking.unbondingDelegations(address)
      return undelegations
    },
  })
}

export const useValidators = () => {
  return useQuery({
    queryKey: ["staking.vaidators"],
    queryFn: async () => {
      const [validator] = await lcd.mstaking.validators()
      return validator
    },
    staleTime: Infinity,
  })
}

export const useValidatorInfos = () => {
  const { data: lbpInfo } = useAPI<{ infos: ValidatorInfo[] }>("/v1/validators", undefined, { staleTime: Infinity })
  const { infos } = lbpInfo || {}
  return new Map(infos?.map((info) => [info.validator, info] as [string, ValidatorInfo]))
}

export const useStakingPool = () => {
  return useQuery({ queryKey: ["staking.pool"], queryFn: async () => await lcd.mstaking.pool() })
}

export const useStakingRewards = () => {
  const address = useAddress()

  return useQuery({
    queryKey: ["distribution.rewards", address],
    queryFn: async () => {
      if (!address) return null
      return await lcd.distribution.rewards(address)
    },
  })
}

export const getFindValidator = (validators: Validator[]) => (address: string) => {
  const validator = validators.find((v) => v.operator_address === address)
  return validator
}

export const getFindMoniker = (validators: Validator[]) => (address: string) => {
  const validator = getFindValidator(validators)(address)
  return validator?.description.moniker
}

export const useStakingPools = (staking?: Delegation[], rewards?: Rewards | null) => {
  const stakingPools = useMemo(() => {
    if (!staking) return []

    const stakingList = staking
      .map((stake) => {
        const { balance, validator_address } = stake
        return balance.toArray().map((amount) => ({ validator_address, ...amount }))
      })
      .flat() as AmountItem[]

    const rewardsList = rewards
      ? (Object.entries(rewards?.rewards ?? {})
          .map(([validator_address, pool]) => {
            return pool.map((item) => {
              const initAmount = item.coins.get("uinit")?.amount
              return { ...item, reward: initAmount, validator_address }
            })
          })
          .flat() as RewardItem[])
      : []

    // merge staking and rewards by validator_address and denom
    const merged = values(
      reduce(
        (acc: Record<string, StakeInfos>, crr: AmountItem | RewardItem) => {
          const key = crr.validator_address + ";" + crr.denom
          const prev = acc?.[key] ?? {}
          return { ...acc, [key]: { ...prev, ...crr, validators: [{ ...prev, ...crr }] } }
        },
        {} as Record<string, StakeInfos>,
        [...stakingList, ...rewardsList]
      )
    )

    // sum amount and reward by denom
    return values(
      reduceBy(
        (acc: StakingPool<StakeInfos>, crr: StakeInfos) => {
          const validators = acc?.validators ?? []
          return {
            ...crr,
            amount: BigNumber(acc?.amount ?? "0")
              .plus(crr?.amount ?? "0")
              .toString(),
            reward: BigNumber(acc?.reward ?? "0")
              .plus(crr?.reward ?? "0")
              .toString(),
            validators: [...validators, { ...crr, rowType: "subRow" }],
            subRows: [...validators, { ...crr, rowType: "subRow" }],
          }
        },
        {} as StakingPool<StakeInfos>,
        (val) => val?.denom,
        (merged ?? []) as StakeInfos[]
      )
    )
  }, [staking, rewards])

  return stakingPools
}
