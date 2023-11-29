import { useNavigate } from "react-router-dom"
import { Box, Drawer, Group, Image, Stack, Text, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { truncate } from "@initia/utils"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { bcs } from "@initia/query"
import type { Token } from "@initia/marketplace-api-types"
import { getGame } from "../../../vendors/games"
import { useAddress, useSignAndBroadcastTxSync } from "../../../data/account"
import useMultiSelect from "../../../hooks/useMultiSelect"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import Check from "../../../components/Check"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import TxSuccess from "../../../components/TxSuccess"
import FixedBottom from "../../../components/FixedBottom"
import StackedImages from "../../../components/StackedImages"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import getVectorSize from "../../../utils/getVectorSize"
import wait from "../../../utils/wait"

const InventoryGameDetailsExportItemList = ({ tokens }: { tokens: Token[] }) => {
  const navigate = useNavigate()

  const collectionAddress = useCollectionAddress()

  /* form */
  const { selected, getIsSelected, selectItem, renderCheckAll } = useMultiSelect(tokens.map((i) => i.tokenAddress))

  /* context */
  const address = useAddress()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()

  /* submit */
  const { mutate, isSuccess, isLoading, reset } = useMutation({
    mutationFn: async (creator: string) => {
      const { api_url } = await getGame(collectionAddress)

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: creator,
            moduleName: "safe_burn",
            functionName: "batch_burn_request",
            typeArgs: [],
            args: [bcs.ser("vector<address>", selected, { size: getVectorSize("address", selected) }).toBytes()],
          }),
        },
      ]
      await signAndBroadcastTxSync(messages)
      await wait(500)
      await axios.post("/user/batch-burn", { token_addresses: selected }, { baseURL: api_url })
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
  const [opened, { open, close }] = useDisclosure()
  const onClose = () => navigate(-1)

  const renderConfirm = () => {
    if (isSuccess) return <TxSuccess onClick={onClose}>{selected.length} items were exported successfully</TxSuccess>

    return (
      <WithCollectionInfo collectionAddress={collectionAddress}>
        {({ name, creator, isPfp }) => (
          <>
            <Stack align="center" spacing={4}>
              <Box py={16}>
                <StackedImages collectionAddress={collectionAddress} tokenAddresses={selected} isPfp={isPfp} />
              </Box>
              <Text mt={6} fz={12} c="mono.5">
                {name}
              </Text>
              <Text fz={20}>{truncate(selected[0])}</Text>
            </Stack>
            <SubmitButton onClick={() => mutate(creator)} loading={isLoading} mt={SUBMIT_MARGIN}>
              Confirm
            </SubmitButton>
          </>
        )}
      </WithCollectionInfo>
    )
  }

  return (
    <Stack spacing={20} pt={24}>
      <Group position="apart">{renderCheckAll()}</Group>

      {tokens.map(({ tokenAddress, name, imageUrl, backgroundColor }) => (
        <UnstyledButton fz={14} fw={700} onClick={() => selectItem(tokenAddress)} key={tokenAddress}>
          <Group spacing={6}>
            <Check checked={getIsSelected(tokenAddress)} />
            <Group spacing={8}>
              <Image bg={backgroundColor} src={imageUrl + "/public"} width={40} height={40} sx={{ borderRadius: 4 }} />
              <Text>{name ?? truncate(tokenAddress)}</Text>
            </Group>
          </Group>
        </UnstyledButton>
      ))}

      <FixedBottom>
        <SubmitButton onClick={() => open()} loading={isLoading} disabled={!selected.length}>
          Export
        </SubmitButton>
      </FixedBottom>

      <Drawer opened={opened} onClose={isSuccess ? onClose : close} title="Export items">
        {renderConfirm()}
      </Drawer>
    </Stack>
  )
}

export default InventoryGameDetailsExportItemList
