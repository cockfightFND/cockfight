import { useNavigate } from "react-router-dom"
import { Box, Drawer, Group, Image, Stack, Text, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { getGame } from "../../../vendors/games"
import type { GameItemExternal } from "../../../data/types"
import useMultiSelect from "../../../hooks/useMultiSelect"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import Check from "../../../components/Check"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import TxSuccess from "../../../components/TxSuccess"
import FixedBottom from "../../../components/FixedBottom"
import InventoryGameDetailsAddItemAdmin from "./InventoryGameDetailsAddItemAdmin"
import StackedImages from "../../../components/StackedImages"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import { SUBMIT_MARGIN } from "../../../styles/variables"

const InventoryGameDetailsImportItemList = ({ list }: { list: GameItemExternal[] }) => {
  const collectionAddress = useCollectionAddress()

  const navigate = useNavigate()

  /* form */
  const { selected, getIsSelected, selectItem, renderCheckAll } = useMultiSelect(list.map((i) => i.item_id))

  /* submit */
  const { mutate, isSuccess, isLoading, reset } = useMutation({
    mutationFn: async () => {
      const { api_url, module_name } = await getGame(collectionAddress)
      await axios.post("/user/batch-mint", { module_name, item_ids: selected }, { baseURL: api_url })
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
    if (isSuccess) return <TxSuccess onClick={onClose}>{selected.length} items were imported successfully</TxSuccess>

    return (
      <>
        <Stack align="center" spacing={4}>
          <WithCollectionInfo collectionAddress={collectionAddress}>
            {({ name, isPfp }) => (
              <>
                <Box py={16}>
                  <StackedImages
                    collectionAddress={collectionAddress}
                    tokenAddresses={selected}
                    isPfp={isPfp}
                    beforeImportedItems={list.filter((item) => selected.includes(item.item_id))}
                  />
                </Box>
                <Text mt={6} fz={12} c="mono.5">
                  {name}
                </Text>
              </>
            )}
          </WithCollectionInfo>
          <Text fz={20}>{selected[0]}</Text>
        </Stack>
        <SubmitButton onClick={() => mutate()} loading={isLoading} mt={SUBMIT_MARGIN}>
          Confirm
        </SubmitButton>
      </>
    )
  }

  return (
    <Stack spacing={20} pt={24}>
      <Group position="apart">
        {renderCheckAll()}
        <InventoryGameDetailsAddItemAdmin currentItemsLength={list.length} />
      </Group>

      {list.map(({ item_id, name, image }) => (
        <UnstyledButton fz={14} fw={700} onClick={() => selectItem(item_id)} key={item_id}>
          <Group spacing={6}>
            <Check checked={getIsSelected(item_id)} />
            <Group spacing={8}>
              <Image src={image} width={40} height={40} />
              <Text>{name}</Text>
            </Group>
          </Group>
        </UnstyledButton>
      ))}

      <FixedBottom>
        <SubmitButton onClick={() => open()} loading={isLoading} disabled={!selected.length}>
          Import
        </SubmitButton>
      </FixedBottom>

      <Drawer opened={opened} onClose={isSuccess ? onClose : close} title="Import items">
        {renderConfirm()}
      </Drawer>
    </Stack>
  )
}

export default InventoryGameDetailsImportItemList
