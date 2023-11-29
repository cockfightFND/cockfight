import { useEffect } from "react"
import { useRecoilValue, useResetRecoilState } from "recoil"
import { Box, Group, Stack, Text } from "@mantine/core"
import type { Token } from "@initia/marketplace-api-types"
import { useHideNavigation } from "../../../app/hooks"
import { usePaginatedAPI } from "../../../data/api"
import { useAddress } from "../../../data/account"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import { GLOBAL_PADDING } from "../../../styles/variables"
import BackButtonBar from "../../../components/BackButtonBar"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import InventoryGameDetailsExportItemList from "./InventoryGameDetailsExportItemList"
import InventoryGameDetailsSearch from "./InventoryGameDetailsSearch"
import FromToLine from "./FromToLine"
import { inventoryFilterState } from "./inventory-filter"

const InventoryGameDetailsExport = () => {
  useHideNavigation()

  const collectionAddress = useCollectionAddress()
  const filter = useRecoilValue(inventoryFilterState)
  const resetFilter = useResetRecoilState(inventoryFilterState)

  const address = useAddress()

  const query = usePaginatedAPI<Token>(`/inventories/${collectionAddress}/${address}`, filter)
  const tokens = query.data?.pages.map((page) => page.data).flat()

  const renderList = () => {
    if (!tokens) return null
    return <InventoryGameDetailsExportItemList tokens={tokens} />
  }

  useEffect(() => {
    resetFilter()
  }, [resetFilter])

  return (
    <>
      <Box bg="white" m={-GLOBAL_PADDING} mb={0}>
        <BackButtonBar />
        <Stack p={GLOBAL_PADDING} pt={10} spacing={0}>
          <Group position="apart" px={20} py={8} fz={12} fw={900} c="mono.7" tt="uppercase">
            <Text>From</Text>
            <Text>To</Text>
          </Group>

          <FromToLine />

          <WithCollectionInfo collectionAddress={collectionAddress}>
            {({ name }) => (
              <Group position="apart" px={20} py={10} fz={20} fw={800}>
                <Text>Initia</Text>
                <Text>{name}</Text>
              </Group>
            )}
          </WithCollectionInfo>
          <Text c="mono.3" fz={14} fw={600} px={16} pt={20} pb={12}>
            Select NFTs to export as game items
          </Text>
        </Stack>
      </Box>

      <InventoryGameDetailsSearch />
      {renderList()}
    </>
  )
}

export default InventoryGameDetailsExport
