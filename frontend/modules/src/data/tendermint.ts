import { useCallback, useMemo } from "react"
import BigNumber from "bignumber.js"
import { useQuery } from "@tanstack/react-query"
import type { Validator } from "@initia/initia.js"
import { lcd } from "../shared/env"

export const useValidatorSet = (height?: number) => {
  return useQuery({
    queryKey: ["tendermint.validatorSet", height],
    queryFn: async () => {
      // FIXME: Iterate if the validators are more than 100
      const [delegateValidator] = await lcd.tendermint.validatorSet(height)
      return delegateValidator
    },
    staleTime: Infinity,
  })
}

/* helpers */
export const useCalcVotingPower = () => {
  const { data: validatorSet } = useValidatorSet()

  const total = useMemo(() => {
    if (!validatorSet) return

    return BigNumber.sum(...validatorSet.map(({ voting_power }) => voting_power)).toString()
  }, [validatorSet])

  return useCallback(
    ({ consensus_pubkey }: Validator) => {
      if (!(validatorSet && total)) return

      const validator = validatorSet.find((validator) => validator.pub_key.key === consensus_pubkey.key)

      if (!validator) return 0

      const { voting_power } = validator

      return new BigNumber(voting_power).div(total).dp(5).toNumber()
    },
    [validatorSet, total]
  )
}
