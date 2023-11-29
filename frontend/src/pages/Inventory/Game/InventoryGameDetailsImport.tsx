import { Box, Group, Stack, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useHideNavigation } from "../../../app/hooks"
import { useGame } from "../../../vendors/games"
import { useAddress } from "../../../data/account"
import type { GameItemExternal } from "../../../data/types"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import { GLOBAL_PADDING } from "../../../styles/variables"
import BackButtonBar from "../../../components/BackButtonBar"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import InventoryGameDetailsImportItemList from "./InventoryGameDetailsImportItemList"
import FromToLine from "./FromToLine"

const InventoryGameDetailsImport = () => {
  useHideNavigation()

  const collectionAddress = useCollectionAddress()
  const address = useAddress()

  const path = `/user/items/${address}`
  const { api_url } = useGame(collectionAddress)
  const { data: items } = useQuery({
    queryKey: [api_url, path],
    queryFn: async () => {
      const { data } = await axios.get<GameItemExternal[]>(path, { baseURL: api_url })
      return data
    },
  })

  if (!items) return null

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
                <Text>{name}</Text>
                <Text>Initia</Text>
              </Group>
            )}
          </WithCollectionInfo>
          <Text c="mono.3" fz={14} fw={600} px={16} pt={20} pb={12}>
            Select game items to be imported as NFTs to start trading
          </Text>
        </Stack>
      </Box>

      <InventoryGameDetailsImportItemList list={items} />
    </>
  )
}

export default InventoryGameDetailsImport
