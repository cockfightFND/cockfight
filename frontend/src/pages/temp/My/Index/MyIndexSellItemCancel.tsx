import { Group, Image, Stack, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { bcs } from "@initia/query"
import type { Token } from "@initia/marketplace-api-types"
import { truncate } from "@initia/utils"
import { MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAddress, useSignAndBroadcastTxSync } from "../../../data/account"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import TxSuccess from "../../../components/TxSuccess"

interface Props extends Token {
  orderId: number
  onFinish: () => void
}

const MyIndexSellItemCancel = ({ tokenAddress, name, imageUrl, backgroundColor, orderId, onFinish }: Props) => {
  if (!orderId) throw new Error("Something went wrong")

  /* context */
  const address = useAddress()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()
  const queryClient = useQueryClient()

  /* submit */
  const { mutate, data, isLoading, reset } = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected")

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: MARKETPLACE_MODULE_ADDRESS,
            moduleName: "marketplace_nft",
            functionName: "cancel_order",
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
      >
        Sell order for {truncate(tokenAddress)} canceled successfully
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

      <Group mt={SUBMIT_MARGIN}>
        <SubmitButton onClick={() => mutate()} loading={isLoading}>
          Confirm
        </SubmitButton>
      </Group>
    </>
  )
}

export default MyIndexSellItemCancel
