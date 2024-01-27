import { useState } from "react"
import { Stack, Drawer, Group, Text, keyframes } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { formatAmount, toAmount, truncate } from "@initia/utils"
import { bcs } from "@initia/query"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import { MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { useAPI } from "../../../data/api"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import SubmitButton from "../../../components/SubmitButton"
import FixedBottom from "../../../components/FixedBottom"
import NumPad from "../../../components/NumPad"
import TxSuccess from "../../../components/TxSuccess"
import { useHideNavigation } from "../../../app/hooks"

interface OrdersConfig {
  auctionCancelFee: number
  auctionGracePeriod: number
  maxAuctionDuration: number
  minIncrease: number
  orderIndex: number
}

interface Props extends TokenDetailResponse {
  onFinish: () => void
}

const MarketItemBid = ({ name, tokenAddress, orders, onFinish }: Props) => {
  useHideNavigation()

  const order = orders?.[0]
  if (!order) throw new Error("Something went wrong")
  const { orderId, auctionInfo } = order
  if (!auctionInfo) throw new Error("Something went wrong")
  const { startPrice, highestBid, expiration } = auctionInfo
  const currentBidAmount = highestBid?.amount ?? startPrice.amount

  const { data: config, isLoading: isConfigLoading } = useAPI<OrdersConfig>("/orders/config")
  const queryClient = useQueryClient()

  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()

  /* form */
  const [input, setInput] = useState("0")
  const amount = toAmount(input, 6)

  /* submit */
  const { mutate, data, isLoading, error, reset } = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected")
      if (BigNumber(amount).gt(balance)) throw new Error("Insufficient balance")
      if (!config) throw new Error("Config not loaded yet")
      const nextBidAmount = currentBidAmount * (1 + config.minIncrease)
      if (!BigNumber(amount).gte(nextBidAmount))
        throw new Error(`Bid amount must be higher than ${formatAmount(nextBidAmount)} INIT`)

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: MARKETPLACE_MODULE_ADDRESS,
            moduleName: "marketplace_nft",
            functionName: "bid",
            typeArgs: [],
            args: [bcs.ser("u64", orderId).toBytes(), bcs.ser("u64", amount).toBytes()],
          }),
        },
      ]

      return await signAndBroadcastTxSync(messages)
    },
  })

  const close = async () => {
    await queryClient.invalidateQueries()
    onFinish()
  }

  const shaking = keyframes({
    "0%": { transform: "translateX(0)" },
    "25%": { transform: "translateX(5px)" },
    "50%": { transform: "translateX(-5px)" },
    "75%": { transform: "translateX(5px)" },
    "100%": { transform: "translateX(0)" },
  })

  const renderBalance = () => {
    if (error instanceof Error) {
      setTimeout(() => reset(), 3000)
      return (
        <Text c="danger" sx={{ animation: `${shaking} 300ms ease-in-out` }}>
          {error.message}
        </Text>
      )
    }

    if (balance)
      return (
        <Text c="mono.4">
          Available{" "}
          <Text span td="underline">
            {formatAmount(balance)}
          </Text>
        </Text>
      )

    return null
  }

  /* render */
  return (
    <>
      <Stack pt={24} align="center">
        {highestBid && (
          <Text fz={12} fw={600} c="mono.6" bg="mono.1" px={11} py={6} sx={{ borderRadius: 8 }}>
            Top Bid: {formatAmount(highestBid.amount)} INIT
          </Text>
        )}
        <Text c={Number(amount) ? "mono.9" : "mono.3"} ta="center">
          <Text fz={52} fw={800} span>
            {input}
          </Text>
          <Text fw={900} span>
            INIT
          </Text>
        </Text>

        {renderBalance()}

        <FixedBottom>
          <Group position="apart" fz={12} px={28} pb={24} w="100%">
            <Text c="mono.5" tt="uppercase" fw={600}>
              End Time
            </Text>
            <Text>{new Date(expiration).toLocaleString()}</Text>
          </Group>
          <NumPad
            onNumberPress={(number) => {
              setInput((prev) => (prev === "0" ? String(number) : prev + number))
            }}
            onDotPress={() => {
              setInput((prev) => (prev.includes(".") ? prev : prev + "."))
            }}
            onBackspacePress={() => {
              if (input.length === 1) setInput("0")
              else setInput((prev) => prev.slice(0, -1))
            }}
          />

          <Group mt={SUBMIT_MARGIN}>
            <SubmitButton onClick={() => mutate()} loading={isLoading || isConfigLoading}>
              Confirm
            </SubmitButton>
          </Group>
        </FixedBottom>
      </Stack>

      {data && (
        <Drawer opened onClose={close}>
          <TxSuccess onClick={close} amount={amount}>
            Bidded {formatAmount(amount)} INIT to {name ?? truncate(tokenAddress)}
          </TxSuccess>
        </Drawer>
      )}
    </>
  )
}

export default MarketItemBid
