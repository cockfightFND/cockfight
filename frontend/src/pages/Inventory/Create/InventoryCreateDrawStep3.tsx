import { useNavigate } from "react-router-dom"
import { useFormContext } from "react-hook-form"
import { Group, Slider, Stack, Text, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useMutation } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { formatAmount, formatPercent, toAmount } from "@initia/utils"
import { bcs } from "@initia/query"
import getVectorSize from "../../../utils/getVectorSize"
import { INIT_METADATA, MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { useAPI } from "../../../data/api"
import FixedBottom from "../../../components/FixedBottom"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import type { FormValues } from "./InventoryCreateDraw"
import useCreateState from "./useCreateState"
import InventoryCreateDrawStepComponent from "./InventoryCreateDrawStepComponent"

const InventoryCreateDrawStep3 = () => {
  const navigate = useNavigate()
  const state = useCreateState()
  const { collectionAddress, tokenAddresses } = state
  const { data: orderCount } = useAPI<{ count: number }>(`/tokens/order-count/${collectionAddress}`)

  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()

  /* form */
  const { register, setValue, handleSubmit, getValues, watch } = useFormContext<FormValues>()
  const { price, sweepAmount } = watch()
  const amount = toAmount(price, 6)
  const [debouncedSweepAmount] = useDebouncedValue(sweepAmount, 200)
  const sweepListQuery = useAPI<{ maxCost: number; orderIds: number[] }>(`/draws/sweep-list/${collectionAddress}`, {
    amount: debouncedSweepAmount,
  })

  /* submit */
  const { mutate, isLoading, reset } = useMutation({
    mutationFn: async ({ title, tokenAddresses, price }: FormValues) => {
      if (!sweepListQuery.data) throw new Error("Sweep list is not loaded yet")
      const { maxCost, orderIds } = sweepListQuery.data
      if (BigNumber(maxCost).gt(balance)) throw new Error("Insufficient balance")

      const amounts = tokenAddresses.map(() => 1)
      const amount = toAmount(price, 6)
      const winAmount = tokenAddresses.length

      const createMessage = () => {
        return {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: MARKETPLACE_MODULE_ADDRESS,
            moduleName: "token_draw",
            functionName: "make_default_pool",
            typeArgs: [],
            args: [
              bcs.ser("string", title).toBytes(),
              bcs.ser("vector<address>", tokenAddresses, { size: getVectorSize("address", tokenAddresses) }).toBytes(),
              bcs.ser("vector<u64>", amounts, { size: getVectorSize("u64", amounts) }).toBytes(),
              bcs.ser("u64", winAmount).toBytes(),
              bcs.ser("address", INIT_METADATA).toBytes(),
              bcs.ser("u64", amount).toBytes(),
              bcs.ser("vector<u64>", orderIds, { size: getVectorSize("u64", orderIds) }).toBytes(),
              bcs.ser("u64", sweepAmount).toBytes(),
            ],
          }),
        }
      }

      const messages = [createMessage()]
      const itemCount = tokenAddresses.length + sweepAmount
      const gasFee = BigNumber(45e4).times(itemCount).plus(2e5).toNumber() || 1e7

      return await signAndBroadcastTxSync(messages, gasFee)
    },
    onSuccess: () => {
      const { collectionAddress, tokenAddresses } = getValues()
      navigate("../result", { state: { ...state, collectionAddress, tokenAddress: tokenAddresses[0] }, replace: true })
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  /* render */
  const total = tokenAddresses.length + sweepAmount
  const probability = tokenAddresses.length / total
  const headerElement = (
    <Group>
      <Stack spacing={4} sx={{ flex: 1 }} ta="center">
        <Text fz={12} fw={600} tt="uppercase">
          Earning
        </Text>
        <Text fz={28} fw={800}>
          {formatAmount(BigNumber(amount).times(calcEarning(total, 0.9)), { integer: true })} INIT
        </Text>
      </Stack>

      <Stack spacing={4} sx={{ flex: 1 }} ta="center">
        <Text fz={12} fw={600} tt="uppercase">
          Probability
        </Text>
        <Text fz={28} fw={800}>
          {formatPercent(probability)}
        </Text>
      </Stack>
    </Group>
  )

  if (!orderCount) return null
  const maxSweepAmount = orderCount.count

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <InventoryCreateDrawStepComponent step={3} title={headerElement} back="../2">
        <Stack>
          <TextInput
            {...register("price", { required: true })}
            label="Draw Price"
            size="xl"
            inputMode="decimal"
            pattern="\d*"
          />

          <Stack>
            <Text>
              Low tier items: {sweepAmount}/{maxSweepAmount}
            </Text>
            <Slider
              value={sweepAmount}
              onChange={(value) => setValue("sweepAmount", value)}
              max={maxSweepAmount}
              size={3}
              thumbSize={32}
            />
          </Stack>
        </Stack>

        <FixedBottom>
          <SubmitButton loading={isLoading} disabled={sweepListQuery.isLoading}>
            Create Draw
          </SubmitButton>
        </FixedBottom>
      </InventoryCreateDrawStepComponent>
    </form>
  )
}

export default InventoryCreateDrawStep3

/* utils */
function calcEarning(total: number, probability: number): number {
  if (total === 1) return 1
  const ratio = (total - 1) / total
  const ln = Math.log(ratio)
  const exp = total * ln * (probability - 1)
  const x = Math.log(exp) / Math.log(ratio) + 1
  return x
}
