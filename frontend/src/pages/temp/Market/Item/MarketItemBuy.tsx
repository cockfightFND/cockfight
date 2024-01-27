import { Group, Image, Stack, Text, Flex } from "@mantine/core"
import { modals } from "@mantine/modals"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { formatAmount, truncate } from "@initia/utils"
import { bcs } from "@initia/query"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import { MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import TxSuccess from "../../../components/TxSuccess"

interface Props extends TokenDetailResponse {
  onFinish: () => void
}

const MarketItemBuy = ({ tokenAddress, name, imageUrl, orders, backgroundColor, onFinish }: Props) => {
  const order = orders?.[0]
  if (!order) throw new Error("Something went wrong")
  const { fixedPrice, orderId } = order
  if (!fixedPrice) throw new Error("Item is not for sale")
  const { amount } = fixedPrice

  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()
  const queryClient = useQueryClient()

  /* submit */
  const { mutate, data, isLoading, reset } = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected")
      if (BigNumber(amount ?? 0).gt(balance)) throw new Error("Insufficient balance")

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: MARKETPLACE_MODULE_ADDRESS,
            moduleName: "marketplace_nft",
            functionName: "execute_order",
            typeArgs: [],
            args: [bcs.ser("u64", orderId).toBytes()],
          }),
        },
      ]

      return await signAndBroadcastTxSync(messages)
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  if (data)
    return (
      <TxSuccess
        onClick={async () => {
          await queryClient.invalidateQueries()
          onFinish()
        }}
        amount={amount}
      >
        Bought {name ?? truncate(tokenAddress)} with {formatAmount(amount)} INIT
      </TxSuccess>
    )

  return (
    <>
      <Stack spacing={8} align="center">
        <Image src={imageUrl + "/public"} bg={backgroundColor} sx={{ borderRadius: 12 }} width={90} height={90} />

        <Stack spacing={2} align="center">
          <Text c="mono.5" fz={11} fw={600}>
            {name}
          </Text>

          <Text fz={18}>{truncate(tokenAddress)}</Text>
        </Stack>
      </Stack>

      <Group position="apart" fz={12} mt={40}>
        <Text c="mono.5" tt="uppercase">
          Price
        </Text>
        <Text fw={800}>{formatAmount(amount)} INIT</Text>
      </Group>
      <Group
        position="apart"
        align="baseline"
        mt={20}
        pt={20}
        sx={({ fn }) => ({ borderTop: `2px dashed ${fn.themeColor("mono.2")}` })}
      >
        <Text fz={14} fw={700} c="mono.7" tt="uppercase">
          Total
        </Text>
        <Flex align="baseline">
          <Text fz={24} fw={900}>
            {formatAmount(amount)}
          </Text>
          <Text fw={800}>INIT</Text>
        </Flex>
      </Group>

      <Group mt={SUBMIT_MARGIN}>
        <SubmitButton onClick={() => mutate()} loading={isLoading}>
          Confirm
        </SubmitButton>
      </Group>
    </>
  )
}

export default MarketItemBuy
